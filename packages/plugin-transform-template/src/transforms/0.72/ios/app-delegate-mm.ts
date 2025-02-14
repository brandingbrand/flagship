import {
  BuildConfig,
  PrebuildOptions,
  string,
} from '@brandingbrand/code-cli-kit';

/**
 * Configuration object for iOS delegate modifications
 */
export default {
  /** Regular expression to match AppDelegate.mm file */
  __test: /\bAppDelegate\.mm$/gm,

  /**
   * Adds React Native Linking Manager import to AppDelegate.mm
   *
   * @param content - The original content of AppDelegate.mm
   * @param config - Build configuration object
   * @returns Modified content with RCTLinkingManager import added if URL scheme is configured
   */
  linkingImport: (content: string, config: BuildConfig): string => {
    if (!config.ios.plist?.urlScheme) {
      return content;
    }

    return string.replace(
      content,
      /(#import "AppDelegate\.h")/,
      `$1

  #import <React/RCTLinkingManager.h>`,
    );
  },

  /**
   * Adds URL handling delegate method to AppDelegate.mm
   *
   * @param content - The original content of AppDelegate.mm
   * @param config - Build configuration object
   * @param options - Prebuild options (unused)
   * @returns Modified content with URL handling delegate method added if URL scheme is configured
   */
  linkingDelegate: (
    content: string,
    config: BuildConfig,
    options: PrebuildOptions,
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

$1`,
    );
  },
};
