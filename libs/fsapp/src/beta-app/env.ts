import { getEnvironmentConfigs, setDefaultEnvironment } from '@brandingbrand/fsenv';
import { EnvSwitcher } from './lib/env-switcher';

let projectEnvs: Record<string, EnvironmentConfig>;

try {
  projectEnvs = require('../../project_env_index');
} catch {
  projectEnvs = getEnvironmentConfigs();
}

setDefaultEnvironment(EnvSwitcher.envName);

console.log(projectEnvs);
export const envs = projectEnvs;
export const env = projectEnvs[`${EnvSwitcher.envName}`] ?? projectEnvs.prod;
