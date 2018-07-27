class WebEnvSwitcher {
  storageKey: string = 'envName';

  get envName(): string {
    const storedEnvName = localStorage.getItem(this.storageKey);

    return storedEnvName || 'prod';
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
