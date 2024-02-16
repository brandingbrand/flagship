/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
} from "@brandingbrand/code-cli-kit";

import * as legacy from "./legacy";
import * as generated from "./generated";
import type { CodePluginSplashScreen } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginSplashScreen>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig & CodePluginSplashScreen} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (
    build: BuildConfig & CodePluginSplashScreen,
    options: PrebuildOptions
  ): Promise<void> {
    if (!build.codePluginSplashScreen.plugin.ios) return;

    if (build.codePluginSplashScreen.plugin.ios.type === "legacy") {
      return legacy.ios(build);
    }

    if (build.codePluginSplashScreen.plugin.ios.type === "generated") {
      return generated.ios(build);
    }
  },

  /**
   * Function to be executed for Android platform.
   * @param {BuildConfig & CodePluginSplashScreen} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (
    build: BuildConfig & CodePluginSplashScreen,
    options: PrebuildOptions
  ): Promise<void> {
    if (!build.codePluginSplashScreen.plugin.android) return;

    if (build.codePluginSplashScreen.plugin.android.type === "legacy") {
      return legacy.android(build);
    }

    if (build.codePluginSplashScreen.plugin.android.type === "generated") {
      return generated.android(build);
    }
  },
});

export type { CodePluginSplashScreen };
