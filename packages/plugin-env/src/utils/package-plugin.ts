import type {PluginConfig} from '@brandingbrand/code-cli-kit';

import type {CodePluginEnvironment} from '../types';

export type EnvPackagePluginConfig = PluginConfig<CodePluginEnvironment> & {
  package: string;
};

export const definePackagePlugin = (
  plugin: EnvPackagePluginConfig,
): EnvPackagePluginConfig => plugin;
