import type {PackageJson} from 'type-fest';

import path from './path';

import type {
  BuildConfig,
  CodeConfig,
  EnvConfig,
  ExtendedBuildConfig,
  PluginConfig,
} from '@/@types';

/**
 * Import paths module to get package.json path
 */

/**
 * Defines a configuration for code.
 *
 * @param config - The configuration object of type CodeConfig.
 * @returns The provided configuration.
 */
export function defineConfig(config: CodeConfig) {
  return config;
}

/**
 * Defines an environment configuration of generic type T.
 *
 * @param env - The environment configuration object of type EnvConfig<T>.
 * @returns The provided environment configuration.
 * @template T - The generic type of the environment configuration.
 */
export function defineEnv<T>(env: EnvConfig<T>) {
  return env;
}

/**
 * Defines a build configuration, which can be either a BuildConfig object
 * or a function that takes a package (pkg) and returns a BuildConfig object.
 *
 * @param build - The build configuration object or function.
 * @returns If build is a function, returns the result of invoking it with an empty object.
 *          If build is not a function, simply returns it.
 */
export function defineBuild<T = BuildConfig>(
  build:
    | ExtendedBuildConfig<T>
    | ((pkg: PackageJson) => ExtendedBuildConfig<T>),
) {
  const pkg: PackageJson = require(path.project.resolve('package.json'));

  if (typeof build === 'function') {
    return build(pkg);
  }

  return build;
}

/**
 * Defines a plugin configuration with two generic type parameters.
 *
 * @param plugin - The plugin configuration object of type PluginConfig<T, U>
 * @returns The provided plugin configuration
 * @template T - The first generic type parameter for the plugin configuration
 * @template U - The second generic type parameter for the plugin configuration
 */
export function definePlugin<T = unknown, U = unknown>(
  plugin: PluginConfig<T, U>,
) {
  return plugin;
}
