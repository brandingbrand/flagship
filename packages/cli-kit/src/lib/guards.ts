/**
 * Importing necessary type declarations from the "@/@types" module.
 */
import type {
  BuildConfig,
  CodeConfig,
  EnvConfig,
  PackageJson,
  PluginConfig,
} from "@/@types";

/**
 * Import paths module to get package.json path
 */
import path from "./path";

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
export function defineBuild(
  build: BuildConfig | ((pkg: PackageJson) => BuildConfig)
) {
  const pkg: PackageJson = require(path.project.resolve("package.json"));

  if (typeof build === "function") {
    return build(pkg);
  }

  return build;
}

/**
 * Defines a plugin configuration of generic type T.
 *
 * @param plugin - The plugin configuration object of type PluginConfig<T>.
 * @returns The provided plugin configuration.
 * @template T - The generic type of the plugin configuration.
 */
export function definePlugin<T>(plugin: PluginConfig<T>) {
  return plugin;
}
