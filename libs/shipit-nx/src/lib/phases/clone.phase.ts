import { ShipConfig } from '../configs/ship.config';

import { Phase } from './phase';

export class ClonePhase implements Phase {
  constructor(private readonly config: ShipConfig) {}
  public readonly readableName = `Clone and configure ${this.config.destinationRepo.url}`;

  public run(): void {
    this.config.destinationRepo.clone().configure();
  }
}
