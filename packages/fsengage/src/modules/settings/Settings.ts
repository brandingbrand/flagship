import SettingsProvider from './providers/SettingsProvider';

export default class Settings {
  provider?: SettingsProvider;
  settings?: { [index: string]: any };

  constructor(provider: SettingsProvider) {
    // TODO | BD: Implement functionality
  }

  async valueForKey(key: string): Promise<any> {
    this.log(key);
    // TODO | BD: Implement functionality

    return this.settings && this.settings[key];
  }

  private log(key: string): void {
    console.log(`Settings\nkey = ${key}\n`);
  }
}
