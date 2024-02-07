import fs from "fs";
import {
  type BuildConfig,
  type PrebuildOptions,
  withUTF8,
  path,
  string,
} from "@brandingbrand/code-cli-kit";

import { Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the iOS project's "app.entitlements" file.
 *
 * @type {typeof defineTransformer<(content: string, config: BuildConfig) => string>} - The type of the transformer.
 * @property {string} file - The name of the file to be transformed ("app.entitlements").
 * @property {Array<(content: string, config: BuildConfig) => string>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<string>} The updated content of the "app.entitlements" file.
 */
export default defineTransformer<Transforms<string>>({
  /**
   * The name of the file to be transformed ("build.gradle").
   * @type {string}
   */
  file: "app.entitlements",

  /**
   * An array of transformer functions to be applied to the "app.entitlements" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: string, config: BuildConfig) => string>}
   */
  transforms: [
    /**
     * Transformer for updating the dependencies in the "app.entitlements" file.
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      if (!config.ios.entitlementsFilePath) return content;

      const customEntitlementsContent = fs.readFileSync(
        path.project.resolve(config.ios.entitlementsFilePath),
        "utf-8"
      );

      return string.replace(content, /[\s\S]*/m, customEntitlementsContent);
    },
  ],
  /**
   * The main transform function that applies all specified transformations to the "app.entitlements" file.
   * @param {BuildConfig} config - The build configuration.
   * @returns {Promise<void>} - The updated content of the "app.entitlements" file.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withUTF8(path.ios.entitlements, (content: string) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config, options);
      }, content);
    });
  },
});
