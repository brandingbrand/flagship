import type SettingsProvider from './providers/SettingsProvider';

export default class Settings {
  constructor(provider: SettingsProvider) {
    // TODO | BD: Implement functionality
  }

  private readonly provider?: SettingsProvider;
  private readonly settings?: Record<string, unknown>;

  private log(key: string): void {
    console.log(`Settings\nkey = ${key}\n`);
  }

  public async valueForKey(key: string): Promise<unknown> {
    this.log(key);
    // TODO | BD: Implement functionality

    return this.settings && this.settings[key];
  }
}
