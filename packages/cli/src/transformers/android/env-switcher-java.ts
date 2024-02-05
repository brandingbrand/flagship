import {
  type BuildConfig,
  withUTF8,
  path,
  PrebuildOptions,
  string,
} from "@brandingbrand/code-cli-kit";

import { Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the Android project's "EnvSwitcher.java" file.
 *
 * @type {typeof defineTransformer<(content: string, config: BuildConfig) => string>} - The type of the transformer.
 * @property {string} file - The name of the file to be transformed ("EnvSwitcher.java").
 * @property {Array<(content: string, config: BuildConfig) => string>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<string>} The updated content of the "EnvSwitcher.java" file.
 */
export default defineTransformer<Transforms<string>>({
  /**
   * The name of the file to be transformed ("EnvSwitcher.java").
   * @type {string}
   */
  file: "EnvSwitcher.java",

  /**
   * An array of transformer functions to be applied to the Gemfile file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: string, config: BuildConfig) => string>}
   */
  transforms: [
    /**
     * Transformer for updating the "initialEnvName" value in "EnvSwitcher.java".
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
        /(initialEnvName = ").*(")/m,
        `$1${options.env}$2`
      );
    },
  ],

  /**
   * The main transform function that applies all specified transformations to the "EnvSwitcher.java" file.
   * @param {BuildConfig} config - The build configuration.
   * @returns {Promise<void>} - The updated content of the "EnvSwitcher.java" file.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withUTF8(path.android.envSwitcher(config), (content: string) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config, options);
      }, content);
    });
  },
});
