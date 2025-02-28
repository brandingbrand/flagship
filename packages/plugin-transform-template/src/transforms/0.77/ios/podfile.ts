import {BuildConfig, string} from '@brandingbrand/code-cli-kit';

import podfile072 from '../../0.72/ios/podfile';

/**
 * Configuration object for modifying iOS Podfile contents.
 * Extends the base podfile configuration from React Native 0.72
 */
export default {
  ...podfile072,

  /**
   * Controls whether the new React Native architecture is enabled in the iOS Podfile
   *
   * @param content - The contents of the Podfile as a string
   * @param config - The build configuration object
   * @param config.ios.podfile.newArchEnabled - Boolean flag to enable/disable new architecture.
   *                                           Defaults to false if not specified.
   * @returns The modified Podfile contents with new architecture setting applied
   */
  newArchEnabled: (content: string, config: BuildConfig): string => {
    return string.replace(
      content,
      /(use_react_native!\(+?)(\s+)/,
      `$1$2:new_arch_enabled => ${!!config.ios.podfile?.newArchEnabled},\n$2`,
    );
  },
};
