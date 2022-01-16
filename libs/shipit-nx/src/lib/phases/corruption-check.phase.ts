import { ShipConfig } from '../configs/ship.config';
import { invariant } from '../utils/invariant.util';

import { Phase } from './phase';

export class CorruptionCheckPhase implements Phase {
  constructor(private readonly config: ShipConfig) {}

  public readonly readableName = 'Check if repository is corrupted';

  public run(): void {
    const repo = this.config.destinationRepo;

    // We should eventually nuke the repo and clone it again. But we do not
    // store the repos in CI yet so it's not necessary. Also, be careful not
    // to nuke monorepo in CI.
    invariant(!repo.isCorrupted(), `Repo located in '${repo.path}' is corrupted.`);
  }
}
