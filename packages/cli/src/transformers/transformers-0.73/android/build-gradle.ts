import {
  type BuildConfig,
  withUTF8,
  path,
  string,
  PrebuildOptions,
} from '@brandingbrand/code-cli-kit';

import {type Transforms, defineTransformer} from '@/lib';

/**
 * Defines a transformer for the Android project's "build.gradle" file.
 *
 * @typedef {Object} AndroidBuildGradleTransformer - Android build.gradle transformer configuration.
 * @property {string} file - The name of the file to be transformed ("build.gradle").
 * @property {Array<(content: string, config: BuildConfig) => string>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<string>} The updated content of the "build.gradle" file.
 */

/**
 * @type {typeof defineTransformer}
 * @template T - Type of transformations to be applied.
 * @param {AndroidBuildGradleTransformer} transformerConfig - Configuration for the Android build.gradle transformer.
 * @returns {Transforms<string>} - The type of the transformer.
 */
export default defineTransformer<Transforms<string>>({
  /**
   * The name of the file to be transformed ("build.gradle").
   * @type {string}
   */
  file: 'build.gradle',

  /**
   * An array of transformer functions to be applied to the "build.gradle" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: string, config: BuildConfig) => string>}
   */
  transforms: [
    /**
     * Transformer for updating the "buildToolsVersion" value in "build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.projectGradle?.buildToolsVersion === undefined)
        return content;

      return string.replace(
        content,
        /(buildToolsVersion\s*=\s*")(\d|.)+(")/m,
        `$1${config.android.gradle.projectGradle.buildToolsVersion}$3`,
      );
    },

    /**
     * Transformer for updating the "minSdkVersion" vlaue in "build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.projectGradle?.minSdkVersion === undefined)
        return content;

      return string.replace(
        content,
        /(minSdkVersion\s*=\s*)[\d]+/m,
        `$1${config.android.gradle.projectGradle.minSdkVersion}`,
      );
    },

    /**
     * Transformer for updating the "compileSdkVersion" value in "build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.projectGradle?.compileSdkVersion === undefined)
        return content;

      return string.replace(
        content,
        /(compileSdkVersion\s*=\s*)[\d]+/m,
        `$1${config.android.gradle.projectGradle.compileSdkVersion}`,
      );
    },

    /**
     * Transformer for updating the "targetSdkVersion" value in "build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.projectGradle?.targetSdkVersion === undefined)
        return content;

      return string.replace(
        content,
        /(targetSdkVersion\s*=\s*)[\d]+/m,
        `$1${config.android.gradle.projectGradle.targetSdkVersion}`,
      );
    },

    /**
     * Transformer for updating the "ndkVersion" value in "build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.projectGradle?.ndkVersion === undefined)
        return content;

      return string.replace(
        content,
        /(ndkVersion\s*=\s*")(\d|.)+(")/m,
        `$1${config.android.gradle.projectGradle.ndkVersion}$3`,
      );
    },

    /**
     * Transformer for updating the "ext" object in "build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.projectGradle?.ext === undefined)
        return content;

      return string.replace(
        content,
        /(ext\s*{\s*?\n(\s+))/m,
        `$1${config.android.gradle.projectGradle.ext.map(it => it).join('\n$2')}\n$2`,
      );
    },

    /**
     * Transformer for updating the "repositories" object in "build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.projectGradle?.repositories === undefined)
        return content;

      return string.replace(
        content,
        /(repositories\s*{\s*?\n(\s+))/m,
        `$1${config.android.gradle.projectGradle.repositories.map(it => it).join('\n$2')}\n$2`,
      );
    },

    /**
     * Transformer for updating the "dependencies" object in "build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.projectGradle?.dependencies === undefined)
        return content;

      return string.replace(
        content,
        /(dependencies\s*{\s*?\n(\s+))/m,
        `$1${config.android.gradle.projectGradle.dependencies.map(it => it).join('\n$2')}\n$2`,
      );
    },
  ],

  /**
   * The main transform function that applies all specified transformations to the "build.gradle" file.
   * @param {BuildConfig} config - The build configuration.
   * @returns {Promise<void>} - The updated content of the "build.gradle" file.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions,
  ): Promise<void> {
    return withUTF8(path.android.buildGradle, (content: string) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config, options);
      }, content);
    });
  },
});
