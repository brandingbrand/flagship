import { ShipConfig, ShipConfigOptions } from './ship.config';

export interface ImportConfigOptions extends ShipConfigOptions {
  pullRequestNumber: string;
}

export class ImportConfig extends ShipConfig {
  constructor(public readonly options: ImportConfigOptions) {
    super(options);
  }

  public readonly pullRequestNumber = this.options.pullRequestNumber;
}
