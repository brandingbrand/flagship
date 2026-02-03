import {BuildConfig, logger} from '@brandingbrand/code-cli-kit';

import podfile072 from '../../0.72/ios/podfile';

/**
 * Configuration object for modifying iOS Podfile contents.
 * Extends the base podfile configuration from React Native 0.72
 */
export default {
  ...podfile072,

  /**
   * Warns that newArchEnabled is ignored in RN82+ and returns content unchanged
   * @param content - The contents of the Podfile as a string
   * @param config - The build configuration object
   * @returns The unmodified Podfile contents
   */
  newArchEnabled: (content: string, config: BuildConfig): string => {
    if (config.ios.podfile?.newArchEnabled !== undefined) {
      logger.warn(
        'newArchEnabled is ignored for podfile in React Native 0.82+, you can safely remove from configuration',
      );
    }

    return content;
  },
};
