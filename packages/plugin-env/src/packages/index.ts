import {EnvPackagePluginConfig} from '../utils';

import codeEnvPlugin from './code-env';
import fsappPlugin from './fsapp';

const plugins: EnvPackagePluginConfig[] = [codeEnvPlugin, fsappPlugin];

export default plugins;
