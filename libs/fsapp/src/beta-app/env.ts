import {
  getEnvironmentConfigs,
  registerEnvironmentConfig,
  setDefaultEnvironment,
} from '@brandingbrand/fsenv';
import { EnvSwitcher } from './lib/env-switcher';

import * as projectEnvs from '../project_env_index';

for (const [name, environment] of Object.entries(projectEnvs)) {
  if (environment) {
    registerEnvironmentConfig(name, environment);
  }
}

setDefaultEnvironment(EnvSwitcher.envName);
export const envs = getEnvironmentConfigs();
if (Object.keys(envs).length === 0) {
  throw new Error('Failed to load any envs, did you forget to run init?');
}

export const env = envs[`${EnvSwitcher.envName}`] ?? envs.prod;
