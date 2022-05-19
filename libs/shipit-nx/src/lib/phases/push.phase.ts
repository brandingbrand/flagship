import type { ShipConfig } from '../configs/ship.config';

import type { Phase } from './phase';

export class PushPhase implements Phase {
  constructor(private readonly config: ShipConfig) {}

  public readonly readableName = 'Push new changes';

  public run(): void {
    this.config.destinationRepo.push(this.config.destinationBranch);
  }
}
