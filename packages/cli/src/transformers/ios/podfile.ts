import {
  type BuildConfig,
  type PrebuildOptions,
  withUTF8,
  path,
  string,
} from "@brandingbrand/code-cli-kit";

import { Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the iOS project's "Podfile" file.
 *
 * @type {typeof defineTransformer<(content: string, config: BuildConfig) => string>} - The type of the transformer.
 * @property {string} file - The name of the file to be transformed ("Podfile").
 * @property {Array<(content: string, config: BuildConfig) => string>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<string>} The updated content of the "Podfile" file.
 */
export default defineTransformer<Transforms<string>>({
  /**
   * The name of the file to be transformed ("Podfile").
   * @type {string}
   */
  file: "Podfile",

  /**
   * An array of transformer functions to be applied to the "Podfile" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: string, config: BuildConfig) => string>}
   */
  transforms: [
    /**
     * Transformer for updating the top-level configuration in "Podfile".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (!config.ios.podfile?.config) return content;

      return string.replace(
        content,
        /(^platform\s+:ios.*\n)/m,
        `$1${config.ios.podfile.config.map((it) => it).join("\n")}`
      );
    },

    /**
     * Transformer for updating the pod dependencies value in "Podfile".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (!config.ios.podfile?.pods) return content;

      return string.replace(
        content,
        /(^target\s*'app'\s*do[\n\s]*)/m,
        `$1${config.ios.podfile.pods.map((it) => it).join("\n  ")}`
      );
    },

    /**
     * Transformer for updating the CocoaPods minimum iOS version  value in "Podfile".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (!config.ios.deploymentTarget) return content;

      return string.replace(
        content,
        /(^platform\s+:ios,\s+).*/m,
        `$1'${config.ios.deploymentTarget}'`
      );
    },
  ],

  /**
   * The main transform function that applies all specified transformations to the "Podfile" file.
   * @param {BuildConfig} config - The build configuration.
   * @returns {Promise<void>} - The updated content of the "Podfile" file.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withUTF8(path.ios.podfile, (content: string) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config, options);
      }, content);
    });
  },
});
