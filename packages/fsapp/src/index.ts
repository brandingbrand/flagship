import * as FSAppTypes from './types';
import { FSApp } from './fsapp/FSApp';

import EnvSwitcher from './lib/env-switcher';
// @ts-ignore project_env_index ignore and will be changed by init
import projectEnvs from '../project_env_index';
const env = projectEnvs[`${EnvSwitcher.envName}`] || projectEnvs.prod;

export { env, FSApp, FSAppTypes };
