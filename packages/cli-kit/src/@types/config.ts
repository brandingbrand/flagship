import type { Android } from "./android";
import type { IOS } from "./ios";

/**
 * Represents the configuration for an Android and iOS build.
 */
export type BuildConfig = {
  android: Android;
  ios: IOS;
};

/**
 * Represents the configuration for a plugin.
 * @template T - The type of the plugin.
 */
export type PluginConfig<T> = {
  ios?: (
    build: BuildConfig,
    env: EnvConfig,
    options: any,
    plugin: T
  ) => Promise<void>;
  android?: (
    build: BuildConfig,
    env: EnvConfig,
    options: any,
    plugin: T
  ) => Promise<void>;
};

/**
 * Represents the configuration for code.
 */
export type CodeConfig = {
  /** The path to the environment file. */
  envPath: string;
  /** The path to the plugin file. */
  pluginPath: string;
  /** An array of plugin names. */
  plugins: string[];
};

/**
 * Represents the configuration for environment settings.
 * @template T - The type of the environment configuration.
 */
export type EnvConfig<T = unknown> = T;

/**
 * Represents options for prebuilding.
 */
export type PrebuildOptions = {
  /** The build version. */
  build: string;
  /** The environment version. */
  env: string;
  /** Indicates whether it's a release build. */
  release: boolean;
  /** Indicates whether to display verbose output. */
  verbose: boolean;
  /** The target platform for prebuilding. */
  platform: "ios" | "android" | "native";
};
