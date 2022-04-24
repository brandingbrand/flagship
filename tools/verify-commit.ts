#!/usr/bin/env ./node_modules/.bin/ts-node

import parseCommit from '@commitlint/parse';
import { Commit } from '@commitlint/types';

import { logger, WorkspaceJsonConfiguration } from '@nrwl/devkit';
import { FsTree } from '@nrwl/tao/src/shared/tree';
import { Workspaces } from '@nrwl/tao/src/shared/workspace';

import dedent from 'ts-dedent';
import { prompt } from 'inquirer';
import { exec, spawnSync } from 'child_process';
import { readFile } from 'fs/promises';
import { sep } from 'path';
import { platform } from 'os';

const commitMessageFile = process.argv[2] as string | undefined;
const whitelistedFiles = [
  'tsconfig.base.json',
  'workspace.json',
  'package.json',
  'package-lock.json',
];

const isTerminalInteractive = !!process.stdin.isTTY;
const confirm = async (message: string) => {
  const inlinedMessage = message.replace(/\n/g, ' ');

  if (isTerminalInteractive) {
    const { confirmed } = await prompt<{ confirmed: boolean }>({
      message: `${inlinedMessage}\n\nAre you sure you want to continue?`,
      name: 'confirmed',
      type: 'confirm',
    });

    return confirmed;
  }

  const os = platform();
  if (os === 'darwin') {
    const appleScript = spawnSync('osascript', [
      '-e',
      dedent`set alertTitle to "Are you sure you want to continue?"
        set alertMessage to "${inlinedMessage}"
        display alert alertTitle message alertMessage as critical buttons {"Don't Continue", "Continue"} default button "Continue" cancel button "Don't Continue"`,
    ]);

    return appleScript.status === 0;
  }

  if (os === 'linux') {
    const whichKdialog = spawnSync('which', ['kdialog']);
    if (whichKdialog.status === 0) {
      const kdialog = spawnSync('kdialog', [
        '--title="Are you sure you want to continue?"',
        '--warningcontinuecancel',
        inlinedMessage,
      ]);

      return kdialog.status === 0;
    }

    const whichZenity = spawnSync('which', ['zenity']);
    if (whichZenity.status === 0) {
      const zenity = spawnSync('zenity', [
        '--question',
        '--width=500',
        '--ok-label=Continue',
        '--cancel-label=Cancel',
        '--title=Are you sure you want to continue?',
        `--text=${inlinedMessage}`,
      ]);

      return zenity.status === 0;
    }
  }

  logger.warn('Confirmation required. Please rerun this commit in an interactive terminal.');
  return false;
};

const isWithin = (file: string, path: string) => {
  const fileDirs = file.split(sep);
  return path.split(sep).every((dir, i) => fileDirs[i] === dir);
};

const getWorkspace = (): WorkspaceJsonConfiguration => {
  return new Workspaces(process.cwd()).readWorkspaceConfiguration();
};

const getStagedFiles = async () => {
  return new Promise<string[]>((resolve, reject) => {
    exec('git diff --name-only --cached', {}, (error, stdout) => {
      if (error) {
        reject(error);
      }

      resolve(stdout.trim().split('\n'));
    });
  });
};

const getChangedProjects = async (
  workspace: WorkspaceJsonConfiguration,
  stagedFiles: string[]
): Promise<string[]> => {
  return Object.entries(workspace.projects)
    .filter(([, { root }]) => root !== '.' && stagedFiles.some((file) => isWithin(file, root)))
    .map(([name]) => name);
};

const verifyBreakingChange = async (commit: Commit) => {
  if (commit.notes.some(({ title }) => title === 'BREAKING CHANGE')) {
    const confirmed = await confirm(dedent`Your commit includes a breaking change, it will only
      be able to be released at the end of Q1 or Q3.`);

    if (!confirmed) {
      logger.error('Breaking change not confirmed.');
      process.exit(1);
    }
  }
};

const verifyProjectScope = async (commit: Commit, changedProjects: string[]) => {
  if (
    commit.scope &&
    changedProjects.length > 0 &&
    changedProjects.some((project) => project !== commit.scope)
  ) {
    const changedProjectsString = changedProjects.join(', ');
    const confirmed = await confirm(dedent`Your change affects ${changedProjectsString} but your
      scope is ${commit.scope}. Typically you would want one commit for each project changed.`);

    if (!confirmed) {
      logger.error('Scope not confirmed.');
      process.exit(1);
    }
  }
};

const rootScopes = ['workspace', 'ci', 'deps', 'repo'];
const verifyWorkspaceScope = async (commit: Commit, changedProjects: string[]) => {
  if (!commit.scope || (!rootScopes.includes(commit.scope) && changedProjects.length === 0)) {
    const confirmed = await confirm(dedent`No projects seem to have been affected, but your scope is
      ${commit.scope}. Typically you would want to use the workspace scope when making changes that
      do not apply to a specific project.`);

    if (!confirmed) {
      logger.error('Scope not confirmed.');
      process.exit(1);
    }
  }
};

const verifyClosedProjectReferences = async (
  workspace: WorkspaceJsonConfiguration,
  stagedFiles: string[]
) => {
  const closedSourceProjects = Object.values(workspace.projects).filter(
    ({ root, tags }) => root !== '.' && !tags?.includes('open-source')
  );

  const openFiles = stagedFiles
    .filter((file) => !closedSourceProjects.some(({ root }) => isWithin(file, root)))
    .filter((file) => !whitelistedFiles.includes(file));

  const tree = new FsTree(process.cwd(), false);
  for (const file of openFiles) {
    const contents = tree.read(file)?.toString('utf-8');

    for (const { root } of closedSourceProjects) {
      if (contents?.includes(root)) {
        const confirmed =
          await confirm(dedent`Found reference to closed source project ${root} in ${file}.
          Typically closed source projects should only be referenced within their own files.`);

        if (!confirmed) {
          logger.error('Reference not confirmed');
          process.exit(1);
        }
      }
    }
  }
};

const main = async (commitFile: string | undefined) => {
  if (commitFile === undefined) {
    logger.error('No commit message provided');
    process.exit(1);
  }

  const commitMessage = (await readFile(commitFile)).toString('utf-8');
  const commit = await parseCommit(commitMessage);

  const workspace = getWorkspace();
  const stagedFiles = await getStagedFiles();

  const changedProjects = await getChangedProjects(workspace, stagedFiles);

  if (commit.scope !== 'release') {
    await verifyBreakingChange(commit);
    await verifyProjectScope(commit, changedProjects);
    await verifyWorkspaceScope(commit, changedProjects);
    await verifyClosedProjectReferences(workspace, stagedFiles);
  }
};

void main(commitMessageFile).catch((error: unknown) => {
  logger.error(error);
  process.exit(1);
});
