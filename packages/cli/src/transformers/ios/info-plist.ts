import {
  type BuildConfig,
  type InfoPlist,
  type PrebuildOptions,
  withInfoPlist,
} from "@brandingbrand/code-cli-kit";
import { mergeAndConcat } from "merge-anything";

import { Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the iOS project's "Info.plist" file.
 *
 * @type {typeof defineTransformer<(content: InfoPlist, config: BuildConfig) => InfoPlist>} - The type of the transformer.
 * @property {string} file - The name of the file to be transformed ("Info.plist").
 * @property {Array<(content: InfoPlist, config: BuildConfig) => InfoPlist>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<InfoPlist>} The updated content of the "Info.plist" file.
 */
export default defineTransformer<Transforms<InfoPlist>>({
  /**
   * The name of the file to be transformed ("Info.plist").
   * @type {string}
   */
  file: "Info.plist",

  /**
   * An array of transformer functions to be applied to the "Info.plist" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: InfoPlist, config: BuildConfig) => InfoPlist>}
   */
  transforms: [
    /**
     * Transformer for updating the dependencies in the "Info.plist" file.
     * @param {InfoPlist} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {InfoPlist} - The updated content.
     */
    (content: InfoPlist, config: BuildConfig): InfoPlist => {
      if (!config.ios.plist) return content;

      const { urlScheme, ...plist } = config.ios.plist;

      return mergeAndConcat<InfoPlist, InfoPlist[]>(content, plist);
    },

    /**
     * Transformer for updating the dependencies in the "Info.plist" file.
     * @param {InfoPlist} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {InfoPlist} - The updated content.
     */
    (content: InfoPlist, config: BuildConfig): InfoPlist => {
      if (!config.ios.plist?.urlScheme) return content;

      const { urlScheme } = config.ios.plist;

      const bundleUrlScheme = urlScheme.host
        ? `${urlScheme.scheme}://${urlScheme.host}`
        : urlScheme.scheme;

      return mergeAndConcat<InfoPlist, InfoPlist[]>(content, {
        CFBundleURLTypes: [{ CFBundleURLSchemes: [bundleUrlScheme] }],
      });
    },

    /**
     * Transformer for updating the style in the "Info.plist" file.
     * @param {InfoPlist} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {InfoPlist} - The updated content.
     */
    (content: InfoPlist, config: BuildConfig): InfoPlist => {
      if (!config.ios.plist?.style) return content;

      function getStyle(style: "light" | "dark" | "system") {
        switch (style) {
          case "dark":
            return "Dark";
          case "light":
            return "Light";
          case "system":
          default:
            return "Automatic";
        }
      }
      return mergeAndConcat<InfoPlist, InfoPlist[]>(content, {
        UIUserInterfaceStyle: getStyle(config.ios.plist.style),
      });
    },

    /**
     * Transformer for updating the dependencies in the "Info.plist" file.
     * @param {InfoPlist} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {InfoPlist} - The updated content.
     */
    (content: InfoPlist, config: BuildConfig): InfoPlist => {
      if (!config.ios.versioning) return content;

      const { version, build = 1 } = config.ios.versioning;

      return mergeAndConcat<InfoPlist, InfoPlist[]>(content, {
        CFBundleShortVersionString: version,
        CFBundleVersion: build.toString(),
      });
    },

    /**
     * Transformer for updating the dependencies in the "Info.plist" file.
     * @param {InfoPlist} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {InfoPlist} - The updated content.
     */
    (content: InfoPlist, config: BuildConfig): InfoPlist => {
      const { displayName, bundleId } = config.ios;

      return mergeAndConcat<InfoPlist, InfoPlist[]>(content, {
        CFBundleIdentifier: bundleId,
        CFBundleDisplayName: displayName,
      });
    },
  ],
  /**
   * The main transform function that applies all specified transformations to the "Info.plist" file.
   * @param {BuildConfig} config - The build configuration.
   * @returns {Promise<void>} - The updated content of the "Info.plist" file.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withInfoPlist((content) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config, options);
      }, content);
    });
  },
});
