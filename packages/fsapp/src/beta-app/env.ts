// @ts-ignore project_env_index ignore and will be changed by init
import projectEnvs from '../../project_env_index';
import { EnvSwitcher } from './lib/env-switcher';

export const envs = projectEnvs;
export const env = projectEnvs[`${EnvSwitcher.envName}`] ?? projectEnvs.prod;
