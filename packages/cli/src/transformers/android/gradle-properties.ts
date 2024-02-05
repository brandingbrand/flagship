import {
  type BuildConfig,
  type PrebuildOptions,
  withUTF8,
  path,
  string,
} from "@brandingbrand/code-cli-kit";

import { type Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the Android project's "gradle.properties" file.
 *
 * @type {typeof defineTransformer<(content: string, config: BuildConfig) => string>} - The type of the transformer.
 * @property {string} file - The name of the file to be transformed ("gradle.properties").
 * @property {Array<(content: string, config: BuildConfig) => string>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<string>} The updated content of the "gradle.properties" file.
 */
export default defineTransformer<Transforms<string>>({
  /**
   * The name of the file to be transformed ("build.gradle").
   * @type {string}
   */
  file: "gradle.properties",

  /**
   * An array of transformer functions to be applied to the "gradle.properties" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: string, config: BuildConfig) => string>}
   */
  transforms: [
    /**
     * Transformer for updating the "android.useAndroidX" property in "gradle.properties".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.properties?.useAndroidX === undefined)
        return content;

      return string.replace(
        content,
        /(android\.useAndroidX=).*/m,
        `$1${config.android.gradle.properties.useAndroidX}`
      );
    },

    /**
     * Transformer for updating the "android.enableJetifier" property in "gradle.properties".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.properties?.enableJetifier === undefined)
        return content;

      return string.replace(
        content,
        /(android\.enableJetifier=).*/m,
        `$1${config.android.gradle.properties.enableJetifier}`
      );
    },

    /**
     * Transformer for updating the "FLIPPER_VERSION" property in "gradle.properties".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (!config.android.gradle?.properties?.FLIPPER_VERSION) return content;

      return string.replace(
        content,
        /(FLIPPER_VERSION=).*/m,
        `$1${config.android.gradle.properties.FLIPPER_VERSION}`
      );
    },

    /**
     * Transformer for updating the "reactNativeArchitectures" property in "gradle.properties".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (!config.android.gradle?.properties?.reactNativeArchitectures)
        return content;

      return string.replace(
        content,
        /(reactNativeArchitectures=).*/m,
        `$1${config.android.gradle.properties.reactNativeArchitectures}`
      );
    },

    /**
     * Transformer for updating the "newArchEnabled" property in "gradle.properties".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.properties?.newArchEnabled === undefined)
        return content;

      return string.replace(
        content,
        /(newArchEnabled=).*/m,
        `$1${config.android.gradle.properties.newArchEnabled}`
      );
    },

    /**
     * Transformer for updating the "hermesEnabled" property in "gradle.properties".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.properties?.hermesEnabled === undefined)
        return content;

      return string.replace(
        content,
        /(hermesEnabled=).*/m,
        `$1${config.android.gradle.properties.hermesEnabled}`
      );
    },
  ],

  /**
   * The main transform function that applies all specified transformations to the "gradle.properties" file.
   *
   * @param config - Build configuration object.
   * @param options - Prebuild options object.
   * @returns A Promise resolving to the updated content of the "gradle.properties" file.
   */
  transform: async function (config: BuildConfig, options: PrebuildOptions) {
    return withUTF8(path.android.gradleProperties, (content: string) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config, options);
      }, content);
    });
  },
});
