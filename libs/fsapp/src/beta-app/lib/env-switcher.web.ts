// __DEFAULT_ENV__ is injected by webpack.
declare const __DEFAULT_ENV__: string;

class WebEnvSwitcher {
  storageKey: string = 'envName';
  defaultAppEnv: string = __DEFAULT_ENV__ || 'prod';

  get envName(): string {
    let storedEnvName;
    try {
      storedEnvName = localStorage.getItem(this.storageKey);
    } catch (e) {
      return '';
    }

    return storedEnvName || this.defaultAppEnv;
  }

  set envName(name: string) {
    if (typeof name === 'string') {
      try {
        localStorage.setItem(this.storageKey, name);
      } catch (e) {
        return;
      }
    }
  }

  // Match the native version's method for type reasons
  async setEnv(name: string): Promise<void> {
    this.envName = name;
  }
}

export const EnvSwitcher = new WebEnvSwitcher();
