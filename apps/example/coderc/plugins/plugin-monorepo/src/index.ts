/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  definePlugin,
  path,
  string,
  withUTF8,
} from '@brandingbrand/code-cli-kit';

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {Object} build - The build configuration object.
 * @param {Object} options - The options object.
 */
export default definePlugin({
  /**
   * Function to be executed for iOS platform.
   * @param {Object} _build - The build configuration object for iOS.
   * @param {Object} _options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (_build: object, _options: object): Promise<void> {},

  /**
   * Function to be executed for Android platform.
   * @param {Object} _build - The build configuration object for Android.
   * @param {Object} _options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (_build: object, _options: object): Promise<void> {
    await withUTF8(
      path.project.resolve('android', 'settings.gradle'),
      content => {
        return string.replace(
          content,
          /(..\/)+?(node_modules)/gm,
          '../../../$2',
        );
      },
    );

    await withUTF8(path.android.appBuildGradle, content => {
      content = string.replace(
        content,
        /(react\s+{\n(\s+))/gm,
        '$1codegenDir = file("../../../../node_modules/@react-native/codegen")\n$2',
      );

      content = string.replace(
        content,
        /(react\s+{\n(\s+))/gm,
        '$1reactNativeDir = file("../../../../node_modules/react-native")\n$2',
      );

      return content;
    });
  },
});
