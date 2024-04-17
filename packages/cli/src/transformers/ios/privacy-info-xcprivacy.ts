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
 * Defines a transformer for the iOS project's "PrivacyInfo.xcprivacy" file.
 *
 * @type {typeof defineTransformer<(content: string, config: BuildConfig) => string>} - The type of the transformer.
 * @property {string} file - The name of the file to be transformed ("PrivacyInfo.xcprivacy").
 * @property {Array<(content: string, config: BuildConfig) => string>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<string>} The updated content of the "PrivacyInfo.xcprivacy" file.
 */
export default defineTransformer<Transforms<string>>({
  /**
   * The name of the file to be transformed ("PrivacyInfo.xcprivacy").
   * @type {string}
   */
  file: "PrivacyInfo.xcprivacy",

  /**
   * An array of transformer functions to be applied to the "PrivacyInfo.xcprivacy" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: string, config: BuildConfig) => string>}
   */
  transforms: [
    /**
     * Transformer for updating the dependencies in the "PrivacyInfo.xcprivacy" file.
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (content: string, config: BuildConfig): string => {
      const { privacyManifestPath } = config.ios;

      if (!privacyManifestPath) return content;

      const privacyManifestAbsolutePath =
        path.project.resolve(privacyManifestPath);

      if (!fs.existsSync(privacyManifestAbsolutePath)) {
        throw new Error(
          `[PrivacyInfoXCPrivacyTransformerError]: path to privacy manifest does not exist ${privacyManifestAbsolutePath}, please update privacyManifestPath to the correct path relative to the root of your React Native project.`
        );
      }

      const privacyManifestContent = fs.readFileSync(
        privacyManifestAbsolutePath,
        "utf-8"
      );

      return string.replace(content, /[\s\S]*/m, privacyManifestContent);
    },
  ],
  /**
   * The main transform function that applies all specified transformations to the "PrivacyInfo.xcprivacy" file.
   * @param {BuildConfig} config - The build configuration.
   * @returns {Promise<void>} - The updated content of the "PrivacyInfo.xcprivacy" file.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withUTF8(path.ios.privacyManifest, (content: string) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config, options);
      }, content);
    });
  },
});
