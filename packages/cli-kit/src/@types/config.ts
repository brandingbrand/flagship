import * as t from "io-ts";

import { BuildConfigSchema, FlagshipCodeConfigSchema } from "@/schemas";

/**
 * Represents the runtime type of the FlagshipCodeConfig object.
 */
export type CodeConfig = t.TypeOf<typeof FlagshipCodeConfigSchema>;

/**
 * Represents the configuration for an Android and iOS build.
 */
export type BuildConfig = t.TypeOf<typeof BuildConfigSchema>;

/**
 * Represents the configuration for environment settings.
 * @template T - The type of the environment configuration.
 */
export type EnvConfig<T = unknown> = T;

/**
 * Represents the configuration for a plugin.
 * @template T - The type of the plugin.
 */
export type PluginConfig<T> = {
  ios?: (build: BuildConfig & T, options: PrebuildOptions) => Promise<void>;
  android?: (build: BuildConfig & T, options: PrebuildOptions) => Promise<void>;
};

export type Plugin<T> = {
  plugin: T;
} & Partial<BuildConfig>;

/**
 * Represents options for prebuilding.
 */
export type PrebuildOptions = {
  /** The build version. */
  build: string;
  /** The command */
  command: string;
  /** The environment version. */
  env: string;
  /** Indicates whether it's a release build. */
  release: boolean;
  /** Indicates whether to display verbose output. */
  verbose: boolean;
  /** The target platform for prebuilding. */
  platform: "ios" | "android" | "native";
};
