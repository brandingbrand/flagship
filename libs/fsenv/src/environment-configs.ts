declare global {
  export interface EngagementConfig {
    appId?: string;
    apiKey?: string;
    baseURL?: string;
    cacheTTL?: number;
  }

  export interface EnvironmentConfig {
    default?: boolean;
    production?: boolean;
    hiddenEnvs?: string[];
    associatedDomains?: string[];
    engagement?: EngagementConfig;
    [key: string]: unknown;
  }

  // eslint-disable-next-line no-var
  export var __FLAGSHIP_ENVIRONMENT_CONFIGS__: Map<string, EnvironmentConfig> | undefined;

  // eslint-disable-next-line no-var
  export var __FLAGSHIP_DEFAULT_ENVIRONMENT__: string | undefined;
}

const globalObject = typeof global !== 'undefined' ? global : window;
const configs = (globalObject.__FLAGSHIP_ENVIRONMENT_CONFIGS__ = new Map<
  string,
  EnvironmentConfig
>());

export const getDefaultEnvironment = () => {
  return globalObject.__FLAGSHIP_DEFAULT_ENVIRONMENT__;
};

export const setDefaultEnvironment = (environment: string) => {
  globalObject.__FLAGSHIP_DEFAULT_ENVIRONMENT__ = environment;
};

export const registerEnvironmentConfig = (environment: string, config: EnvironmentConfig) => {
  configs.set(environment, config);
};

export const registerEnvironmentConfigs = (configs: Record<string, EnvironmentConfig>) => {
  for (const [environment, config] of Object.entries(configs)) {
    if (config.default) {
      setDefaultEnvironment(environment);
    }
    registerEnvironmentConfig(environment, config);
  }
};

export const getEnvironmentConfig = (environment?: string) => {
  const currentEnvironment = environment ?? globalObject.__FLAGSHIP_DEFAULT_ENVIRONMENT__;

  if (currentEnvironment === undefined) {
    throw new Error('Default environment could not be found');
  }

  if (!configs.has(currentEnvironment)) {
    throw new Error(`${currentEnvironment} is not registered as a valid environment`);
  }

  return configs.get(currentEnvironment) as EnvironmentConfig;
};

export const getEnvironmentConfigs = () => {
  return Object.fromEntries(configs.entries());
};
