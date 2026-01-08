import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
  version,
} from '@brandingbrand/code-cli-kit';

import {ios as ios72} from './ios/0.72';
import {ios as ios77} from './ios/0.77';
import {android as android72} from './android/0.72';
import {android as android73} from './android/0.73';
import {android as android74} from './android/0.74';
import {android as android77} from './android/0.77';

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (
    build: BuildConfig,
    options: PrebuildOptions,
  ): Promise<void> {
    const pluginIOS = version.select({
      '0.72': ios72,
      '0.77': ios77,
    });

    return pluginIOS(build, options);
  },

  /**
   * Function to be executed for Android platform.
   * @param {BuildConfig} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (
    build: BuildConfig,
    options: PrebuildOptions,
  ): Promise<void> {
    const pluginAndroid = version.select({
      '0.72': android72,
      '0.73': android73,
      '0.74': android74,
      '0.77': android77,
    });

    return pluginAndroid(build, options);
  },
});
