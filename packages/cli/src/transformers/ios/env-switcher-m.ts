import { type BuildConfig, withUTF8, path } from "@brandingbrand/code-cli-kit";

import { defineTransformer } from "@/lib";

/**
 * Defines a transformer for the iOS project's "EnvSwitcher.m" file.
 *
 * @type {typeof defineTransformer<(content: string, config: BuildConfig) => string>} - The type of the transformer.
 * @property {string} file - The name of the file to be transformed ("EnvSwitcher.m").
 * @property {Array<(content: string, config: BuildConfig) => string>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<string>} The updated content of the "EnvSwitcher.m" file.
 */
export default defineTransformer<
  (content: string, config: BuildConfig) => string
>({
  file: "EnvSwitcher.m",
  transforms: [
    (content: string, config: BuildConfig) => {
      return "";
    },
  ],
  transform: async function (config: BuildConfig) {
    return withUTF8(path.ios.envSwitcher, (content: string) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config);
      }, content);
    });
  },
});
