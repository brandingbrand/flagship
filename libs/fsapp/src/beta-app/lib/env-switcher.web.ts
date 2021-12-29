import { getDefaultEnvironment, getEnvironmentConfigs } from '@brandingbrand/fsenv';

// __DEFAULT_ENV__ is injected by webpack.
declare const __DEFAULT_ENV__: string | undefined;

class WebEnvSwitcher {
  storageKey: string = 'envName';
  defaultAppEnv: string = __DEFAULT_ENV__ || getDefaultEnvironment() || 'prod';

  get envName(): string {
    try {
      const savedEnvName = localStorage.getItem(this.storageKey);
      if (
        typeof savedEnvName === 'string' &&
        Object.keys(getEnvironmentConfigs()).includes(savedEnvName)
      ) {
        return savedEnvName;
      }
    } catch {
      return this.defaultAppEnv;
    }

    return this.defaultAppEnv;
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

export const EnvSwitcher = new WebEnvSwitcher();
