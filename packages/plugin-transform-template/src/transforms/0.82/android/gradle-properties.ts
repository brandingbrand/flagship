import {BuildConfig, logger} from '@brandingbrand/code-cli-kit';

import gradleProperties072 from '../../0.72/android/gradle-properties';

/**
 * Configuration object for Android Gradle properties.
 * Extends the base gradle properties configuration from React Native 0.72
 */
export default {
  ...gradleProperties072,

  /**
   * Warns that newArchEnabled is ignored in RN82+ and returns content unchanged
   * @param content - The current content of gradle.properties
   * @param config - Build configuration object containing Android settings
   * @returns The unmodified gradle.properties content
   */
  newArchEnabled: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.properties?.newArchEnabled !== undefined) {
      logger.warn(
        'newArchEnabled is ignored for gradle properties in React Native 0.82+, you can safely remove from configuration',
      );
    }

    return content;
  },
};
