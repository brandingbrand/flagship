import {
  type BuildConfig,
  type PrebuildOptions,
  withUTF8,
  path,
  string,
} from "@brandingbrand/code-cli-kit";

import { Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the iOS project's "EnvSwitcher.m" file.
 *
 * @type {typeof defineTransformer<(content: string, config: BuildConfig) => string>} - The type of the transformer.
 * @property {string} file - The name of the file to be transformed ("EnvSwitcher.m").
 * @property {Array<(content: string, config: BuildConfig) => string>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<string>} The updated content of the "EnvSwitcher.m" file.
 */
export default defineTransformer<Transforms<string>>({
  /**
   * The name of the file to be transformed ("EnvSwitcher.m").
   * @type {string}
   */
  file: "EnvSwitcher.m",

  /**
   * An array of transformer functions to be applied to the "EnvSwitcher.m" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: string, config: BuildConfig) => string>}
   */
  transforms: [
    /**
     * Transformer for updating the "initialEnvName" value in "EnvSwitcher.m".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (
      content: string,
      config: BuildConfig,
      options: PrebuildOptions
    ): string => {
      return string.replace(
        content,
        /(\*initialEnvName\s+=\s+@").*(")/m,
        `$1${options.env}$2`
      );
    },
  ],

  /**
   * The main transform function that applies all specified transformations to the "EnvSwitcher.m" file.
   * @param {BuildConfig} config - The build configuration.
   * @returns {Promise<void>} - The updated content of the "EnvSwitcher.m" file.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withUTF8(path.ios.envSwitcher, (content: string) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config, options);
      }, content);
    });
  },
});
