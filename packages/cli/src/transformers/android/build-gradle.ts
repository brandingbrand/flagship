import { type BuildConfig, withUTF8 } from "@brandingbrand/code-cli-kit";

import { defineTransformer } from "@/lib";

/**
 * Defines a transformer for the Android project's "build.gradle" file.
 *
 * @type {typeof defineTransformer<(content: string, config: BuildConfig) => string>} - The type of the transformer.
 * @property {string} file - The name of the file to be transformed ("build.gradle").
 * @property {Array<(content: string, config: BuildConfig) => string>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<string>} The updated content of the "build.gradle" file.
 */
export default defineTransformer<
  (content: string, config: BuildConfig) => string
>({
  file: "build.gradle",
  transforms: [
    (content: string, config: BuildConfig) => {
      return content.replace(
        /(compileSdkVersion)\s+".+"/gm,
        `$1 "${config.android.gradle?.projectGradle?.compileSdkVersion}"`
      );
    },
  ],
  transform: async function (config: BuildConfig) {
    return withUTF8("/path/to/build.gradle", (content: string) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config);
      }, content);
    });
  },
});
