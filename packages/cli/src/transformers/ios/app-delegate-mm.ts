import {
  type BuildConfig,
  type PrebuildOptions,
  withUTF8,
  path,
  string,
} from "@brandingbrand/code-cli-kit";

import { Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the iOS project's "AppDelegate.mm" file.
 *
 * @type {typeof defineTransformer<(content: string, config: BuildConfig) => string>} - The type of the transformer.
 * @property {string} file - The name of the file to be transformed ("AppDelegate.mm").
 * @property {Array<(content: string, config: BuildConfig) => string>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<string>} The updated content of the "AppDelegate.mm" file.
 */
export default defineTransformer<Transforms<string>>({
  /**
   * The name of the file to be transformed ("AppDelegate.mm").
   * @type {string}
   */
  file: "AppDelegate.mm",

  /**
   * An array of transformer functions to be applied to the "AppDelegate.mm" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: string, config: BuildConfig) => string>}
   */
  transforms: [
    /**
     * Transformer for add RCTLinkingManager import in "AppDelegate.mm".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (
      content: string,
      config: BuildConfig,
      options: PrebuildOptions
    ): string => {
      if (!config.ios.plist?.urlScheme) {
        return content;
      }

      return string.replace(
        content,
        /(#import "AppDelegate\.h")/,
        `$1

#import <React/RCTLinkingManager.h>`
      );
    },

    /**
     * Transformer for add delegate method in "AppDelegate.mm".
     * @param {string} content - The content of the file.
     * @param {BuildConfig} config - The build configuration.
     * @returns {string} - The updated content.
     */
    (
      content: string,
      config: BuildConfig,
      options: PrebuildOptions
    ): string => {
      if (!config.ios.plist?.urlScheme) {
        return content;
      }

      return string.replace(
        content,
        /(@end)/,
        `- (BOOL)application:(UIApplication *)application
  openURL:(NSURL *)url
  options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([RCTLinkingManager application:application openURL:url options:options]) {
    return YES;
  }

  return NO;
}

$1`
      );
    },
  ],

  /**
   * The main transform function that applies all specified transformations to the "AppDelegate.mm" file.
   * @param {BuildConfig} config - The build configuration.
   * @returns {Promise<void>} - The updated content of the "AppDelegate.mm" file.
   */
  transform: async function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withUTF8(path.ios.appDelegate, (content: string) => {
      return this.transforms.reduce((acc, curr) => {
        return curr(acc, config, options);
      }, content);
    });
  },
});
