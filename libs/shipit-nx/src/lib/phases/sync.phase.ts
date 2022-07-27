import type { Commit } from '@brandingbrand/git';

import { logger } from '@nrwl/devkit';

import type { ShipConfig } from '../configs/ship.config';

import type { Phase } from './phase';

export class SyncPhase implements Phase {
  constructor(private readonly config: ShipConfig) {}
  private readonly sourceRepo = this.config.sourceRepo;
  public readonly readableName = 'Synchronize repository';

  private *getSourceCommits(
    initialRevision: string,
    isFirstCommit: boolean
  ): Generator<Commit, void> {
    const descendantsPath = this.sourceRepo.findDescendantsPath(initialRevision);
    const revisions = isFirstCommit
      ? [initialRevision, ...(descendantsPath ?? [])]
      : descendantsPath;

    if (revisions !== undefined) {
      for (const revision of revisions) {
        const commit = this.sourceRepo.getCommitFromID(revision);
        if (commit !== undefined) {
          yield commit;
        }
      }
    }
  }

  private *getFilteredCommits(commits: Generator<Commit, void>): Generator<Commit, void> {
    const filter = this.config.getEgressFilter();
    for (const commit of commits) {
      for (const filteredCommit of filter(commit)) {
        yield filteredCommit;
      }
    }
  }

  public *run(): Generator<number, void> {
    let initialRevision = this.config.destinationRepo.findLastSourceCommit();
    let isFirstCommit = false;
    if (initialRevision === undefined) {
      // Seems like it's a new repo so there is no signed commit.
      // Let's take the first one from our source repo instead.
      initialRevision = this.sourceRepo.findFirstAvailableCommit();
      isFirstCommit = true;
    }

    const commitCount =
      this.sourceRepo.getRevisionDistance(initialRevision) + (isFirstCommit ? 1 : 0);

    const sourceCommits = this.getSourceCommits(initialRevision, isFirstCommit);
    const filteredCommits = this.getFilteredCommits(sourceCommits);
    const { destinationRepo } = this.config;

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
          logger.error(`Failed on ${filterCommit.subject} by ${filterCommit.author}`);
          logger.error(filterCommit.id);

          throw error;
        }
      }

      progress += 1;
      yield progress / commitCount;
    }
  }
}
