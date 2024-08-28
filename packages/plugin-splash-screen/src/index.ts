/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
  getReactNativeVersion,
} from '@brandingbrand/code-cli-kit';

import * as legacy72 from './legacy-0.72';
import * as legacy73 from './legacy-0.73';
import * as generated72 from './generated-0.72';
import * as generated73 from './generated-0.73';
import type {CodePluginSplashScreen} from './types';

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
    options: PrebuildOptions,
  ): Promise<void> {
    if (!build.codePluginSplashScreen.plugin.ios) return;

    if (build.codePluginSplashScreen.plugin.ios.type === 'legacy') {
      // legacy72 and legacy73 are the same for iOS
      return legacy72.ios(build);
    }

    if (build.codePluginSplashScreen.plugin.ios.type === 'generated') {
      // generated72 and generated73 are the same for iOS
      return generated72.ios(build);
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
    options: PrebuildOptions,
  ): Promise<void> {
    if (!build.codePluginSplashScreen.plugin.android) return;

    if (build.codePluginSplashScreen.plugin.android.type === 'legacy') {
      switch (getReactNativeVersion()) {
        case '0.74':
        case '0.73':
          return legacy73.android(build);
        case '0.72':
        default:
          return legacy72.android(build);
      }
    }

    if (build.codePluginSplashScreen.plugin.android.type === 'generated') {
      switch (getReactNativeVersion()) {
        case '0.74':
        case '0.73':
          return generated73.android(build);
        case '0.72':
        default:
          return generated72.android(build);
      }
    }
  },
});

export type {CodePluginSplashScreen};
