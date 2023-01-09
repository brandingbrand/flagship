import { mergeDeep } from '@brandingbrand/standard-object';

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/naming-convention, import/no-mutable-exports -- Attaching to global object
  export var __FLAGSHIP_ENVIRONMENT_CONFIGS__: Map<string, EnvironmentConfig> | undefined;

  // eslint-disable-next-line no-var, @typescript-eslint/naming-convention, import/no-mutable-exports -- Attaching to global object
  export var __FLAGSHIP_DEFAULT_ENVIRONMENT__: string | undefined;

  // eslint-disable-next-line no-var, @typescript-eslint/naming-convention, import/no-mutable-exports -- Attaching to global object
  export var __FLAGSHIP_ENVIRONMENT_OVERRIDE__:
    | Record<string, Partial<EnvironmentConfig>>
    | undefined;

  export interface EngagementConfig {
    appId: string;
    apiKey?: string;
    baseURL: string;
    cacheTTL: number;
  }

  export interface CachingConfig {
    components?: boolean;
    fonts?: boolean;
    routes?: boolean;
    screens?: boolean;
    theme?: boolean;
    breakpoints?: boolean;
  }

  export interface EnvironmentConfig {
    [key: string]: unknown;
    default?: boolean;
    /**
     * @deprecated
     */
    disableCaching?: boolean;
    production?: boolean;
    hiddenEnvs?: string[];
    associatedDomains?: string[];
    engagement: EngagementConfig;
    caching?: CachingConfig;
  }
}

const globalObject = typeof global !== 'undefined' ? global : window;
globalObject.__FLAGSHIP_ENVIRONMENT_CONFIGS__ = new Map<string, EnvironmentConfig>();
const environmentConfigs = globalObject.__FLAGSHIP_ENVIRONMENT_CONFIGS__;

export const overrideEnvironmentConfig = (
  override: Record<string, Partial<EnvironmentConfig>>
): void => {
  globalObject.__FLAGSHIP_ENVIRONMENT_OVERRIDE__ = override;

  for (const [environment, overrideConfig] of Object.entries(override)) {
    const currentConfig = environmentConfigs.get(environment) ?? {};
    environmentConfigs.set(
      environment,
      mergeDeep(currentConfig, overrideConfig as EnvironmentConfig)
    );
  }
};

export const getDefaultEnvironment = (): string | undefined =>
  globalObject.__FLAGSHIP_DEFAULT_ENVIRONMENT__;

export const setDefaultEnvironment = (environment: string): void => {
  globalObject.__FLAGSHIP_DEFAULT_ENVIRONMENT__ = environment;
};

export const registerEnvironmentConfig = (environment: string, config: EnvironmentConfig): void => {
  environmentConfigs.set(environment, config);
};

export const registerEnvironmentConfigs = (configs: Record<string, EnvironmentConfig>): void => {
  for (const [environment, config] of Object.entries(configs)) {
    if (config.default === true) {
      setDefaultEnvironment(environment);
    }

    registerEnvironmentConfig(environment, config);
  }

  if (globalObject.__FLAGSHIP_ENVIRONMENT_OVERRIDE__) {
    overrideEnvironmentConfig(globalObject.__FLAGSHIP_ENVIRONMENT_OVERRIDE__);
  }
};

export const getEnvironmentConfig = (environment?: string): EnvironmentConfig => {
  const currentEnvironment = environment ?? globalObject.__FLAGSHIP_DEFAULT_ENVIRONMENT__;

  if (currentEnvironment === undefined) {
    throw new Error('Default environment could not be found');
  }

  if (!environmentConfigs.has(currentEnvironment)) {
    throw new Error(`${currentEnvironment} is not registered as a valid environment`);
  }

  return environmentConfigs.get(currentEnvironment) as EnvironmentConfig;
};

export const getEnvironmentConfigs = (): Record<string, EnvironmentConfig> =>
  Object.fromEntries(environmentConfigs.entries());

export const getOverride = (): Partial<EnvironmentConfig> | undefined =>
  globalObject.__FLAGSHIP_ENVIRONMENT_OVERRIDE__;
