import { getEnvironmentConfigs, setDefaultEnvironment } from '@brandingbrand/fsenv';
import { EnvSwitcher } from './lib/env-switcher';

import * as projectEnvs from '../project_env_index';

setDefaultEnvironment(EnvSwitcher.envName);

export const envs = projectEnvs.unset === null ? getEnvironmentConfigs() : projectEnvs;
if (Object.keys(envs).length === 0) {
  throw new Error('Failed to load any envs, did you forget to run init?');
}

export const env = envs[`${EnvSwitcher.envName}`] ?? envs.prod;
