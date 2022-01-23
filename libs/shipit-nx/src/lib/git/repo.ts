import * as fs from 'fs';
import { basename, dirname, join } from 'path';
import { dedent } from 'ts-dedent';

import { extractRepoId } from '../utils/extract-repo-id.util';
import { invariant } from '../utils/invariant.util';
import { parsePatchHeader } from '../utils/parse-patch-header.util';
import { parsePatch } from '../utils/parse-patch.util';
import { splitHead } from '../utils/split-head.util';

import { accounts } from './accounts';
import { Commit, Diff, Header } from './commit';
import { ShellCommand } from './shell-command';

export interface SourceRepo {
  getCurrentRevision: () => string;
  findFirstAvailableCommit: () => string;
  findDescendantsPath: (
    baseRevision: string,
    headRevision?: string
  ) => readonly string[] | undefined;
  getCommitFromID: (revision: string) => Commit | undefined;
}

export interface DestinationRepo {
  findLastSourceCommit: () => string | undefined;
  commitPatch: (commit: Commit) => string;
  checkoutBranch: (branchName: string) => void;
  push: (branch: string) => void;
}

export class Repo implements SourceRepo, DestinationRepo {
  constructor(public readonly path: string, private readonly sourceUrl?: string) {}

  private get isRepo(): boolean {
    return fs.existsSync(join(this.path, '.git'));
  }

  private gitCommand(...args: readonly string[]): ShellCommand {
    return new ShellCommand(this.path, 'git', '--no-pager', ...args).setEnvironmentVariables(
      new Map([
        // https://git-scm.com/docs/git#_environment_variables
        ['GIT_CONFIG_NOSYSTEM', '1'],
        ['GIT_TERMINAL_PROMPT', '0'],
      ])
    );
  }

  /**
   * Renders commit to be later used with `git am` command.
   *
   * @param commit the changes to stringify
   * @return the stringified change
   */
  private stringifyPatch(commit: Commit): string {
    let renderedDiffs = '';
    invariant(commit.diffs.size > 0, 'It is not possible to render empty commit.'); // https://stackoverflow.com/a/34692447

    for (const diff of Array.from(commit.diffs)) {
      const { body, path } = diff;
      renderedDiffs += `diff --git a/${path} b/${path}\n${body}`;
    }

    // Insert a space before patterns that will make `git am` think that a line in the commit
    // message is the start of a patch, which is an artifact of the way `git am` tries to tell
    // where the message ends and the diffs begin. This fix is a hack; a better fix might be to
    // use `git apply` and `git commit` directly instead of `git am`. It's inspired by the same
    // fix in `facebook/fbshipit` code.
    //
    // See: https://git-scm.com/docs/git-am/2.32.0#_discussion
    // See: https://github.com/git/git/blob/ebf3c04b262aa27fbb97f8a0156c2347fecafafb/mailinfo.c#L649-L683
    // See: https://github.com/facebook/fbshipit/blob/bd0df15c3c18a6645da7a765789ab60c5ffc3a45/src/shipit/repo/ShipItRepoGIT.php#L236-L240
    const commitMessage = commit.commitMessage.replace(
      /^(?<patch>diff -|Index: |---(?:\s\S|\s*$))/m,
      ' $1'
    );

    // Mon Sep 17 is a magic date used by format-patch to distinguish from real mailboxes
    // see: https://git-scm.com/docs/git-format-patch
    return dedent`From ${commit.id} Mon Sep 17 00:00:00 2001
                    From: ${commit.author}
                    Date: ${commit.timestamp}
                    Subject: [PATCH] ${commitMessage}

                    ${renderedDiffs}
                    --
                    2.21.0
                    `;
  }

  private getNativePatchFromID(revision: string): string {
    return this.gitCommand(
      'format-patch',
      '--no-renames',
      '--no-stat',
      '--stdout',
      '--full-index',
      '--format=', // contain nothing but the code changes
      '-1',
      revision
    ).runSynchronously().stdout;
  }

  private getNativeHeaderFromIDWithPatch(revision: string, patch: string): string | undefined {
    const fullPatch = this.gitCommand(
      'format-patch',
      '--no-renames',
      '--no-stat',
      '--stdout',
      '--full-index',
      '-1',
      revision
    ).runSynchronously().stdout;

    if (patch.length === 0) {
      // this is an empty commit, so it has no details
      return undefined;
    }
    return fullPatch.replace(patch, '');
  }

  private getCommitFromExportedPatch(header: string, patch: string): Commit {
    const commit = parsePatchHeader(header);
    const diffs = new Set<Diff>();
    for (const hunk of Array.from(parsePatch(patch))) {
      const diff = this.parseDiffHunk(hunk);
      if (diff !== undefined) {
        diffs.add(diff);
      }
    }
    return commit.withDiffs(diffs);
  }

  public get url(): string {
    return (
      this.sourceUrl ??
      this.gitCommand('remote', 'get-url', 'origin').runSynchronously().stdout.trim()
    );
  }

  public get id(): string | undefined {
    return extractRepoId(this.url);
  }

  public clone(): this {
    if (!this.isRepo) {
      if (this.sourceUrl === undefined) {
        throw new Error(`${this.path} is not a GIT repo.`);
      }

      const dir = dirname(this.path);
      const name = basename(this.path);
      new ShellCommand(dir, 'git', 'clone', this.sourceUrl, name).runSynchronously();
    }

    return this;
  }

  public push(destinationBranch: string): this {
    this.gitCommand('push', 'origin', destinationBranch).runSynchronously();

    return this;
  }

  public configure(): this {
    const username = 'branderbot';
    for (const [key, value] of Object.entries({
      'user.email': accounts.get(username) as string,
      'user.name': username,
      'commit.gpgsign': 'false',
    })) {
      this.gitCommand('config', key, value).runSynchronously();
    }

    return this;
  }

  // https://git-scm.com/docs/git-checkout
  public checkoutBranch(branchName: string): this {
    this.gitCommand(
      'checkout',
      '-B', // create (or switch to) a new branch
      branchName
    ).runSynchronously();

    return this;
  }

  public clean(): this {
    this.gitCommand(
      'clean', // remove untracked files from the working tree
      '-x', // ignore .gitignore
      '-f', // force
      '-f', // double force
      '-d' // remove untracked directories in addition to untracked files
    ).runSynchronously();

    return this;
  }

  public isCorrupted(): boolean {
    const { exitCode } = this.gitCommand('fsck', '--strict').setNoExceptions().runSynchronously();
    return exitCode !== 0;
  }

  public findLastSourceCommit(): string | undefined {
    const log = this.gitCommand(
      'log',
      '-1',
      '--grep',
      '^brandingbrand-source-id: \\?[a-z0-9]\\+\\s*$'
    )
      .setNoExceptions() // empty repo fails with: "your current branch 'master' does not have any commits yet"
      .runSynchronously()
      .stdout.trim();

    const regex = /brandingbrand-source-id: ?(?<commit>[\da-z]+)$/gm;
    let lastCommit;
    let match;
    while ((match = regex.exec(log)) !== null) {
      lastCommit = match.groups?.commit;
    }

    return lastCommit;
  }

  // https://stackoverflow.com/a/5189296/3135248
  public findFirstAvailableCommit(): string {
    // Please note, the following command may return multiple roots. For example,
    // `git` repository has 6 roots (and we should take the last one).
    const rawOutput = this.gitCommand('rev-list', '--max-parents=0', 'HEAD').runSynchronously()
      .stdout;
    const rootRevisions = rawOutput.trim().split('\n');
    return rootRevisions[rootRevisions.length - 1];
  }

  public getBranch(): string {
    const branch = this.gitCommand('rev-parse', '--abbrev-ref', 'HEAD').runSynchronously().stdout;

    return branch.trim();
  }

  public getCurrentRevision(): string {
    const branch = this.gitCommand('rev-parse', 'HEAD').runSynchronously().stdout;

    return branch.trim();
  }

  public getCommitFromID(revision: string): Commit | undefined {
    const patch = this.getNativePatchFromID(revision);
    const header = this.getNativeHeaderFromIDWithPatch(revision, patch);
    if (header === undefined) {
      return undefined;
    }

    const commit = this.getCommitFromExportedPatch(header, patch);
    return commit.withID(revision);
  }

  public parseDiffHunk(hunk: string): { body: string; path: string } | undefined {
    const [head, tail] = splitHead(hunk, '\n');
    const match = /^diff --git [ab]\/.*? [ab]\/(?<path>.*?)$/.exec(head);
    if (!match) {
      return undefined;
    }

    const path = match.groups?.path;
    if (path === undefined) {
      throw new Error('Cannot parse path from the hunk.');
    }

    return { path, body: tail };
  }

  public findDescendantsPath(
    baseRevision: string,
    headRevision?: string
  ): readonly string[] | undefined {
    const log = this.gitCommand(
      'log',
      '--reverse',
      '--ancestry-path',
      '--no-merges',
      '--pretty=tformat:%H',
      `${baseRevision}..${headRevision ?? this.getCurrentRevision()}`,
      '--' // separates paths from revisions (so you can use non-existent paths)
    ).runSynchronously().stdout;

    const trimmedLog = log.trim();
    return trimmedLog === '' ? undefined : trimmedLog.split('\n');
  }

  public commitPatch(commit: Commit): string {
    if (commit.diffs.size === 0) {
      // This is an empty commit, which `git am` does not handle properly.
      this.gitCommand(
        'commit',
        '--allow-empty',
        '--author',
        commit.author,
        '--date',
        commit.timestamp,
        '--message',
        commit.commitMessage
      ).runSynchronously();
    } else {
      const diff = this.stringifyPatch(commit);
      try {
        this.gitCommand('am', '--keep-non-patch', '--keep-cr', '--whitespace=nowarn')
          .setStdin(diff)
          .runSynchronously();
      } catch (error: unknown) {
        this.gitCommand('am', '--abort').runSynchronously();
        throw error;
      }
    }
    // git rev-parse --verify HEAD
    // git --no-pager log -1 --pretty=format:%H
    return this.gitCommand('rev-parse', '--verify', 'HEAD').runSynchronously().stdout.trim();
  }

  /**
   * This function exports specified roots from the monorepo. It takes a
   * snapshot of HEAD revision and exports it to the destination path.
   * Please note: this export is unfiltered.
   *
   * @param exportedRepoPath the path to write the repos files to
   */
  public export(exportedRepoPath: string): void {
    const archivePath = join(exportedRepoPath, 'archive.tar.gz');
    this.gitCommand(
      'archive',
      '--format=tar',
      `--output=${archivePath}`,
      'HEAD'
    ).runSynchronously();

    // Previously, we used only STDIN but that didn't work for some binary files like images for some reason.
    // So now we create an actual archive and use this instead.
    new ShellCommand(exportedRepoPath, 'tar', '-xvf', archivePath).runSynchronously();
    fs.rmSync(archivePath);
  }

  public getJsonFromRevision<T>(revision: string, path: string): T {
    const file = this.gitCommand('show', `${revision}:${path}`).runSynchronously().stdout;
    return JSON.parse(file) as T;
  }

  public getCommitIdFromRevision(revision: string): string {
    return this.gitCommand('rev-list', '--max-count', '1', `${revision}`).runSynchronously().stdout;
  }

  public stageAll(): Repo {
    this.gitCommand('add', '-A').runSynchronously();
    return this;
  }

  public commit(message: Header): Repo {
    this.gitCommand(
      'commit',
      '--no-verify',
      '--allow-empty',
      '-m',
      dedent`${message.type}(${message.scope}): ${message.subject}`
    ).runSynchronously();

    return this;
  }
}
