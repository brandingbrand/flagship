import { AppRegistry } from 'react-native';

import { EnvSwitcher } from '../lib/env-switcher';

import type { AppConfig, WebApplication } from './types';

export const getVersion = async (config: AppConfig<any>): Promise<string> =>
  `${config.version ?? ''}\nenv:${EnvSwitcher.envName ?? 'prod'}`;

const isWebRegistry = (
  registry: typeof AppRegistry
): registry is typeof AppRegistry & {
  getApplication: (app: string, props?: Record<string, unknown>) => WebApplication;
} => 'getApplication' in registry;

export const getApp = (): WebApplication | undefined =>
  isWebRegistry(AppRegistry) ? AppRegistry.getApplication('Flagship', {}) : undefined;
