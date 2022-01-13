import { getEnvironmentConfigs, setDefaultEnvironment } from '@brandingbrand/fsenv';
import { EnvSwitcher } from './lib/env-switcher';

let projectEnvs: Record<string, EnvironmentConfig>;

try {
  projectEnvs = require('../../project_env_index');
} catch {
  projectEnvs = getEnvironmentConfigs();
  if (Object.keys(projectEnvs).length === 0) {
    throw new Error('Failed to load any envs, did you forget to run init?');
  }
}

setDefaultEnvironment(EnvSwitcher.envName);

export const envs = projectEnvs;
export const env = projectEnvs[`${EnvSwitcher.envName}`] ?? projectEnvs.prod;
