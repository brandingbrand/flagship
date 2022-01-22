import { logger } from '@nrwl/devkit';

import { Commit } from '../git/commit';
import { ShipConfig } from '../configs/ship.config';

import { Phase } from './phase';

export class SyncPhase implements Phase {
  constructor(private readonly config: ShipConfig) {}
  private readonly sourceRepo = this.config.sourceRepo;
  public readonly readableName = 'Synchronize repository';

  private getSourceCommits(): Set<Commit> {
    let initialRevision = this.config.destinationRepo.findLastSourceCommit();
    let firstCommit = false;
    if (initialRevision === undefined) {
      // Seems like it's a new repo so there is no signed commit.
      // Let's take the first one from our source repo instead.
      initialRevision = this.sourceRepo.findFirstAvailableCommit();
      firstCommit = true;
    }

    const sourceCommits = new Set<Commit>();
    const descendantsPath = this.sourceRepo.findDescendantsPath(initialRevision);
    const revisions = firstCommit ? [initialRevision, ...(descendantsPath ?? [])] : descendantsPath;

    if (revisions !== undefined) {
      for (const revision of revisions) {
        const commit = this.sourceRepo.getCommitFromID(revision);
        if (commit !== undefined) {
          sourceCommits.add(commit);
        }
      }
    }

    return sourceCommits;
  }

  private getFilteredCommits(): Commit[] {
    const commits = this.getSourceCommits();
    const filter = this.config.getEgressFilter();
    return Array.from(commits).map((commit) => filter(commit));
  }

  public run(): void {
    const commits = this.getFilteredCommits();
    const { destinationBranch, destinationRepo } = this.config;
    destinationRepo.checkoutBranch(destinationBranch);

    for (const commit of commits) {
      if (commit.header.merge === true) {
        throw new Error(
          'Unrecoverable error, merge commit found in change set. Shipit requires a linear git history'
        );
      }

      if (commit.isValid()) {
        try {
          destinationRepo.commitPatch(commit);
        } catch (error: unknown) {
          logger.error(
            `Failed on ${commit.header.type}(${commit.header.scope}):${commit.subject} by ${commit.author}`
          );
          logger.error(commit.id);
          for (const diff of commit.diffs) {
            logger.error(diff.path);
            logger.error(diff.body);
          }
          throw error;
        }
      }
    }
  }
}
