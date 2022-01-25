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

  private *getFilteredCommits(commits: Set<Commit>): Generator<Commit, void> {
    const filter = this.config.getEgressFilter();
    for (const commit of commits) {
      yield filter(commit);
    }
  }

  public *run(): Generator<number, void> {
    const sourceCommits = this.getSourceCommits();
    const filteredCommits = this.getFilteredCommits(sourceCommits);
    const { destinationBranch, destinationRepo } = this.config;
    destinationRepo.checkoutBranch(destinationBranch);

    let progress = 0;
    for (const filterCommit of filteredCommits) {
      if (filterCommit.header.merge === true) {
        throw new Error(
          'Unrecoverable error, merge commit found in change set. Shipit requires a linear git history'
        );
      }

      if (filterCommit.isValid()) {
        try {
          destinationRepo.commitPatch(filterCommit);
        } catch (error: unknown) {
          logger.error(
            `Failed on ${filterCommit.header.type}(${filterCommit.header.scope}):${filterCommit.subject} by ${filterCommit.author}`
          );
          logger.error(filterCommit.id);
          for (const diff of filterCommit.diffs) {
            logger.error(diff.path);
            logger.error(diff.body);
          }
          throw error;
        }
      }

      progress += 1;
      yield progress / sourceCommits.size;
    }
  }
}
