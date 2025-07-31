import {PluginConfig} from '@brandingbrand/code-cli-kit';

import {CodePluginEnvironment} from '../types';

import codeEnvPlugin from './code-env';
import fsappPlugin from './fsapp';

export const packageTransforms = {
  '@brandingbrand/fsapp': fsappPlugin,
  '@brandingbrand/code-app-env': codeEnvPlugin,
} satisfies Record<string, PluginConfig<CodePluginEnvironment>>;
