import type { Dictionary } from '@brandingbrand/fsfoundation';
import type { AppConfig, WebApplication } from './types';

import { AppRegistry } from 'react-native';

import { EnvSwitcher } from '../lib/env-switcher';

export const getVersion = async (config: AppConfig<any>): Promise<string> => {
  return `${config.version ?? ''}\nenv:${EnvSwitcher.envName ?? 'prod'}`;
};

const isWebRegistry = (
  registry: typeof AppRegistry
): registry is typeof AppRegistry & {
  getApplication(app: string, props?: Dictionary): WebApplication;
} => {
  return 'getApplication' in registry;
};

export const getApp = (): WebApplication | undefined => {
  return isWebRegistry(AppRegistry) ? AppRegistry.getApplication('Flagship', {}) : undefined;
};
