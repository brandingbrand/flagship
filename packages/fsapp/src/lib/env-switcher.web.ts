// __DEFAULT_ENV__ is injected by webpack.
declare const __DEFAULT_ENV__: string;

class WebEnvSwitcher {
  storageKey: string = 'envName';
  defaultAppEnv: string = __DEFAULT_ENV__ || 'prod';

  get envName(): string {
    const storedEnvName = localStorage.getItem(this.storageKey);

    return storedEnvName || this.defaultAppEnv;
  }

  set envName(name: string) {
    if (typeof name === 'string') {
      localStorage.setItem(this.storageKey, name);
    }
  }

  // Match the native version's method for type reasons
  async setEnv(name: string): Promise<void> {
    this.envName = name;
  }
}

const EnvSwitcher = new WebEnvSwitcher();
export default EnvSwitcher;
