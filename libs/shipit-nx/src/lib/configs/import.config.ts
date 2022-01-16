import { ShipConfig } from './ship.config';

export class ImportConfig extends ShipConfig {
  constructor(
    public readonly pullRequestNumber: string,
    sourcePath: string,
    destinationRepoURL: string,
    destinationBranch = 'main'
  ) {
    super(sourcePath, destinationRepoURL, destinationBranch);
  }
}
