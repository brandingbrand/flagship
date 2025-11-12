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
  ios: async function (): Promise<void> {},

  android: async function (): Promise<void> {
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
        '$1reactNativeDir = file("../../../../node_modules/react-native")\n$2',
      );

      content = string.replace(
        content,
        /(react\s+{\n(\s+))/gm,
        '$1codegenDir = file("../../../../node_modules/@react-native/codegen")\n$2',
      );

      return content;
    });
  },
});
