import {
  BuildConfig,
  InfoPlist,
  PrebuildOptions,
} from '@brandingbrand/code-cli-kit';
import {mergeAndConcat} from 'merge-anything';

/**
 * Configuration for transforming iOS Info.plist files
 */
export default {
  /** Regular expression to match Info.plist files */
  __test: /\bInfo\.plist$/gm,

  /**
   * Merges general plist items from the config into the content
   * @param content - The current Info.plist content
   * @param config - The build configuration
   * @returns The merged Info.plist content
   */
  items: (content: InfoPlist, config: BuildConfig): InfoPlist => {
    if (!config.ios.plist) return content;

    const {urlScheme, ...plist} = config.ios.plist;

    return mergeAndConcat<InfoPlist, InfoPlist[]>(content, plist);
  },

  /**
   * Sets up URL scheme handling for the app
   * @param content - The current Info.plist content
   * @param config - The build configuration
   * @returns The updated Info.plist with URL scheme configuration
   */
  urlScheme: (content: InfoPlist, config: BuildConfig): InfoPlist => {
    if (!config.ios.plist?.urlScheme) return content;

    const {urlScheme} = config.ios.plist;

    const bundleUrlScheme = urlScheme.host
      ? `${urlScheme.scheme}://${urlScheme.host}`
      : urlScheme.scheme;

    return mergeAndConcat<InfoPlist, InfoPlist[]>(content, {
      CFBundleURLTypes: [{CFBundleURLSchemes: [bundleUrlScheme]}],
    });
  },

  /**
   * Configures the app's interface style (light/dark/system)
   * @param content - The current Info.plist content
   * @param config - The build configuration
   * @returns The updated Info.plist with interface style settings
   */
  style: (content: InfoPlist, config: BuildConfig): InfoPlist => {
    if (!config.ios.plist?.style) return content;

    function getStyle(style: 'light' | 'dark' | 'system') {
      switch (style) {
        case 'dark':
          return 'Dark';
        case 'light':
          return 'Light';
        case 'system':
        default:
          return 'Automatic';
      }
    }
    return mergeAndConcat<InfoPlist, InfoPlist[]>(content, {
      UIUserInterfaceStyle: getStyle(config.ios.plist.style),
    });
  },

  /**
   * Sets the app's version and build numbers
   * @param content - The current Info.plist content
   * @param config - The build configuration
   * @returns The updated Info.plist with versioning information
   */
  versioning: (content: InfoPlist, config: BuildConfig): InfoPlist => {
    if (!config.ios.versioning) return content;

    const {version, build = 1} = config.ios.versioning;

    return mergeAndConcat<InfoPlist, InfoPlist[]>(content, {
      CFBundleShortVersionString: version,
      CFBundleVersion: build.toString(),
    });
  },

  /**
   * Sets the app's bundle identifier and display name
   * @param content - The current Info.plist content
   * @param config - The build configuration
   * @returns The updated Info.plist with app identifiers
   */
  identifiers: (content: InfoPlist, config: BuildConfig): InfoPlist => {
    const {displayName, bundleId} = config.ios;

    return mergeAndConcat<InfoPlist, InfoPlist[]>(content, {
      CFBundleIdentifier: bundleId,
      CFBundleDisplayName: displayName,
    });
  },

  /**
   * Manages exception domains for network security configuration
   * Removes localhost exception domain in release builds
   * @param content - The current Info.plist content
   * @param config - The build configuration
   * @param options - Prebuild options including release flag
   * @returns The updated Info.plist with modified exception domains
   */
  exceptionDomains: (
    content: InfoPlist,
    config: BuildConfig,
    options: PrebuildOptions,
  ): InfoPlist => {
    if (!options.release) return content;

    if (!content.NSAppTransportSecurity?.NSExceptionDomains) return content;

    const {localhost, ...exceptionDomainsWithoutLocalhost} =
      content.NSAppTransportSecurity.NSExceptionDomains;

    return {
      ...content,
      NSAppTransportSecurity: {
        NSExceptionDomains: exceptionDomainsWithoutLocalhost,
      },
    };
  },

  /**
   * Configures supported interface orientations for the app
   * @param content - The current Info.plist content
   * @param config - The build configuration
   * @param options - Prebuild options
   * @returns The updated Info.plist with orientation settings
   */
  orientation: (
    content: InfoPlist,
    config: BuildConfig,
    options: PrebuildOptions,
  ): InfoPlist => {
    if (!config.ios.plist?.orientation) return content;

    const {UISupportedInterfaceOrientations, ...newContent} = content;

    const orientations = config.ios.plist.orientation.map(it => {
      switch (it) {
        case 'portrait':
          return 'UIInterfaceOrientationPortrait';
        case 'portraitUpsideDown':
          return 'UIInterfaceOrientationPortraitUpsideDown';
        case 'landscapeLeft':
          return 'UIInterfaceOrientationLandscapeLeft';
        case 'landscapeRight':
          return 'UIInterfaceOrientationLandscapeRight';
        default:
          throw new Error(
            `[InfoPlistTransformerError]: ${it} is not a supported orientation`,
          );
      }
    });

    return mergeAndConcat<InfoPlist, InfoPlist[]>(newContent, {
      UISupportedInterfaceOrientations: orientations,
    });
  },
};
