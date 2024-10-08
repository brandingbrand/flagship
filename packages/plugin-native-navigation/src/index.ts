/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
  fs,
  getReactNativeVersion,
} from '@brandingbrand/code-cli-kit';

import {android as android72} from './android-0.72';
import {android as android73} from './android-0.73';

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
    // Resolve path to react-native-navigation postlink path module
    const rnnPath = require.resolve(
      'react-native-navigation/autolink/postlink/path.js',
      {paths: [process.cwd()]},
    );

    // Update mainApplicationJava in postlink path module
    await fs.update(rnnPath, /(mainApplicationJava)\S*(replace)/, `$1?.$2`);

    // Resolve path to react-native-navigation postlink IOS script
    const scriptPath = require.resolve(
      'react-native-navigation/autolink/postlink/postLinkIOS.js',
      {paths: [process.cwd()]},
    );

    // Set executable permission for postlink IOS script
    await fs.chmod(scriptPath, '755');

    // Require postlink IOS script
    const rnnIOSLink = require(scriptPath);

    // Execute postlink IOS script
    await rnnIOSLink();
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
    switch (getReactNativeVersion()) {
      case '0.73':
        return android73(build, options);
      case '0.72':
      default:
        return android72(build, options);
    }
  },
});
