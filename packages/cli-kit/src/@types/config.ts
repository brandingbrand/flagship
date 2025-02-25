import * as t from 'io-ts';
import type {PartialDeep} from 'type-fest';

import {BuildConfigSchema, FlagshipCodeConfigSchema} from '@/schemas';

/**
 * Represents the runtime type of the FlagshipCodeConfig object.
 */
export type CodeConfig = t.TypeOf<typeof FlagshipCodeConfigSchema>;

/**
 * Represents the configuration for an Android and iOS build.
 */
export type BuildConfig = t.TypeOf<typeof BuildConfigSchema>;

/**
 * A utility type that enforces the structure of `BuildConfig` and allows for optional extensions.
 *
 * If the generic type `T` is exactly `BuildConfig`, it returns `BuildConfig`.
 * Otherwise, it returns a type that merges `BuildConfig` with `T`, allowing
 * for additional properties specified in `T`.
 *
 * @template T - The optional type extensions to `BuildConfig`.
 */
export type ExtendedBuildConfig<T> = T extends BuildConfig
  ? BuildConfig
  : BuildConfig & T;

/**
 * Represents the configuration for environment settings.
 * @template T - The type of the environment configuration.
 */
export type EnvConfig<T = unknown> = T;

/**
 * Represents the configuration for a plugin.
 * @template T - The type of the plugin.
 */
export type PluginConfig<T, O = PrebuildOptions> = {
  common?: (build: BuildConfig & T, options: O) => Promise<void>;
  ios?: O extends PrebuildOptions
    ? (build: BuildConfig & T, options: PrebuildOptions) => Promise<void>
    : never;
  android?: O extends PrebuildOptions
    ? (build: BuildConfig & T, options: PrebuildOptions) => Promise<void>
    : never;
};

export type Plugin<T> = {
  plugin: T;
} & PartialDeep<BuildConfig>;

/**
 * Represents the default cli command options.
 */
type Options = {
  /** Log levels */
  logLevel: 'debug' | 'log' | 'info' | 'warn' | 'error';
};

/**
 * Represents options for prebuild cli command.
 */
export type PrebuildOptions = {
  /** The build version. */
  build: string;
  /** The cli command. */
  command: string;
  /** The environment version. */
  env: string;
  /** Indicates whether it's a release build. */
  release: boolean;
  /** Indicates whether to display verbose output. */
  verbose: boolean;
  /** The target platform for prebuilding. */
  platform: 'ios' | 'android' | 'native';
} & Options;

/**
 * Represents options for generate cli command.
 */
export type GenerateOptions = {
  /**
   * Type of generator - only "plugin" is available currently
   */
  type: 'plugin';
  /**
   * Name of your plugin. This will be reflected in your package.json and
   * in your flagship-code.config.ts.
   */
  name: string;
  /**
   * The cli command.
   */
  command: string;
} & Options;

/**
 * Represents options for align-deps cli command.
 */
export type AlignDepsOptions = {
  /**
   * Fix package.json dependencies.
   */
  fix: boolean;

  /**
   * React Native profile based on React Native version.
   */
  profile: '0.72' | '0.73' | '0.74' | '0.75' | '0.76' | '0.77' | '0.78';

  /**
   * The cli command.
   */
  command: string;
};
