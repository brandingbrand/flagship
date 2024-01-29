/* eslint-disable no-unused-vars */

import type { Android } from "./android";
import type { IOS } from "./ios";

export type BuildConfig = {
  android: Android;
  ios: IOS;
};

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

export type CodeConfig = {
  envPath: string;
  pluginPath: string;
  plugins: string[];
};

export type EnvConfig<T = unknown> = T;
