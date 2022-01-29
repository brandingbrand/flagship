import { Commit, DestinationRepo, SourceRepo } from '@brandingbrand/git';
import { ShellCommand } from '@brandingbrand/shell';

import { ImportConfig } from '../configs/import.config';

import { Phase } from './phase';

export class ImportSyncPhase implements Phase {
  constructor(private readonly config: ImportConfig) {}

  public readonly readableName = `Syncing changes from ${this.config.pullRequestNumber}`;

  private getSourceCommits(): Set<Commit> {
    new ShellCommand(
      this.config.destinationRepo.path,
      'git',
      'fetch',
      'origin',
      `refs/pull/${this.config.pullRequestNumber}/head`
    ).runSynchronously();

    // 'git rev-parse FETCH_HEAD' to get actual hash
    const mergeBase = new ShellCommand(
      this.config.destinationRepo.path,
      'git',
      'merge-base',
      'FETCH_HEAD',
      this.config.destinationBranch
    )
      .runSynchronously()
      .stdout.trim();

    const sourceCommits = new Set<Commit>();
    const exportedRepo: SourceRepo = this.config.destinationRepo;
    const descendantsPath = exportedRepo.findDescendantsPath(mergeBase, 'FETCH_HEAD');
    if (descendantsPath !== undefined) {
      for (const revision of descendantsPath) {
        const commit = exportedRepo.getCommitFromID(revision);
        if (commit !== undefined) {
          sourceCommits.add(commit);
        }
      }
    }

    return sourceCommits;
  }

  private *getFilteredCommits(): Generator<Commit, void> {
    const commits = this.getSourceCommits();
    const filter = this.config.getIngressFilter();
    for (const commit of commits) {
      for (const filteredCommit of filter(commit)) {
        yield filteredCommit;
      }
    }
  }

  public run(): void {
    const monorepo: DestinationRepo = this.config.sourceRepo;
    const commits = this.getFilteredCommits();

    const branchName = `shipit-import-github-pr-${this.config.pullRequestNumber}`;
    monorepo.checkoutBranch(branchName);

    for (const commit of commits) {
      if (commit.header.merge === true) {
        throw new Error(
          'Unrecoverable error, merge commit found in change set. Shipit requires a linear git history'
        );
      }

      if (commit.isValid()) {
        monorepo.commitPatch(commit);
      }
    }
  }
}
