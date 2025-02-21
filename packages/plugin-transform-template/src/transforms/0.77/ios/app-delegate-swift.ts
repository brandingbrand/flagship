import {
  BuildConfig,
  PrebuildOptions,
  string,
} from '@brandingbrand/code-cli-kit';

/**
 * Configuration object for iOS URL scheme and delegate modifications in Swift.
 * This module handles adding URL handling capabilities to the iOS app delegate.
 */
export default {
  /**
   * Regular expression pattern to match AppDelegate.swift file.
   * Uses word boundary \b to ensure exact matches and multiline flag for multiple occurrences.
   */
  __test: /\bAppDelegate\.swift$/gm,

  /**
   * Adds URL handling delegate method to AppDelegate.swift to enable deep linking.
   * This method injects the necessary Swift code to handle incoming URLs by overriding
   * the application(_:open:options:) method from UIApplicationDelegate.
   *
   * @param content - The original source content of AppDelegate.swift file
   * @param config - Build configuration object containing iOS specific settings
   * @param options - Prebuild options passed from the build system (currently unused)
   * @returns The modified AppDelegate.swift content with URL handling code injected if
   *          a URL scheme is configured in the iOS plist settings, otherwise returns
   *          the original content unchanged.
   *
   * @example
   * // Example config with URL scheme:
   * {
   *   ios: {
   *     plist: {
   *       urlScheme: 'myapp'
   *     }
   *   }
   * }
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
      /(class AppDelegate: RCTAppDelegate {)/,
      `$1

  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    return RCTLinkingManager.application(app, open: url, options: options)
  }`,
    );
  },
};
