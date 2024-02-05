import {
  type BuildConfig,
  type PrebuildOptions,
  withUTF8,
  path,
  string,
} from "@brandingbrand/code-cli-kit";

import { type Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the Android project's "app-build.gradle" file.
 *
 * @typedef {Object} AndroidAppBuildGradleTransformer - Android app-build.gradle transformer configuration.
 * @property {string} file - The name of the file to be transformed ("app-build.gradle").
 * @property {Array<(content: string, config: BuildConfig) => string>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<string>} The updated content of the "app-build.gradle" file.
 */

/**
 * @type {typeof defineTransformer}
 * @template {(content: string, config: BuildConfig) => string} T - Type of transformations to be applied.
 * @param {AndroidAppBuildGradleTransformer} transformerConfig - Configuration for the Android app-build.gradle transformer.
 * @returns {Transforms<string>} - The type of the transformer.
 */
export default defineTransformer<Transforms<string>>({
  /**
   * The name of the file to be transformed ("app-build.gradle").
   * @type {string}
   */
  file: "app-build.gradle",

  /**
   * An array of transformer functions to be applied to the "app-build.gradle" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: string, config: BuildConfig) => string>}
   */
  transforms: [
    /**
     * Transformer for updating the "namespace" value in "app-build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      return string.replace(
        content,
        /(namespace\s*")(\w|\.)+(")/m,
        `$1${config.android.packageName}$3`
      );
    },

    /**
     * Transformer for updating the "applicationId" value in "app-build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      return string.replace(
        content,
        /(applicationId\s*")(\w|\.)+(")/m,
        `$1${config.android.packageName}$3`
      );
    },

    /**
     * Transformer for updating the "versionCode" value in "app-build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (!config.android.versioning?.build) return content;

      return string.replace(
        content,
        /(versionCode\s+)\d+/m,
        `$1${config.android.versioning?.build}`
      );
    },

    /**
     * Transformer for updating the "versionName" value in "app-build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (!config.android.versioning?.version) return content;

      return string.replace(
        content,
        /(versionName\s*")(\w|\.)+(")/m,
        `$1${config.android.versioning?.version}$3`
      );
    },

    /**
     * Transformer for updating the "signingConfigs" section in "app-build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig) => {
      return string.replace(
        content,
        /(signingConfigs\s*{\s*)/m,
        `$1release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
        `
      );
    },

    /**
     * Transformer for updating the "buildTypes" section in "app-build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig) => {
      return string.replace(
        content,
        /(buildTypes\s*{[\s\S]*release\s*{[\s\S]*signingConfig\s+).*/m,
        "$1signingConfigs.release"
      );
    },

    /**
     * Transformer for updating the "dependencies" section in "app-build.gradle".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (config.android.gradle?.appGradle?.dependencies === undefined)
        return content;

      return string.replace(
        content,
        /(dependencies\s*{[\s\S]\s+)/m,
        `$1${config.android.gradle.appGradle.dependencies.map((it) => it).join("\n    ")}`
      );
    },
  ],

  /**
   * The main transform function that applies all specified transformations to the "app-build.gradle" file.
   * @param {BuildConfig} config - The build configuration.
   * @returns {Promise<void>} - The updated content of the "app-build.gradle" file.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withUTF8(path.android.appBuildGradle, (content: string) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config, options);
      }, content);
    });
  },
});
