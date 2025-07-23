import {BuildConfig, string} from '@brandingbrand/code-cli-kit';

import {default as buildGradle072} from '../../0.72/android/build-gradle';

/**
 * Configuration object that extends the Android build.gradle configurations from version 0.72
 * with additional kotlin version handling capabilities.
 */
export default {
  ...buildGradle072,

  /**
   * Updates the Kotlin version in the build.gradle file based on provided configuration.
   *
   * @param content - The current content of the build.gradle file as a string
   * @param config - Build configuration object containing Android-specific settings
   * @returns Modified content string with updated Kotlin version if specified in config,
   *          otherwise returns original content unchanged
   *
   * @example
   * // Updates kotlinVersion = "1.4.0" to kotlinVersion = "1.5.0" if specified in config
   * kotlinVersion(gradleContent, {
   *   android: {
   *     gradle: {
   *       projectGradle: {
   *         kotlinVersion: "1.5.0"
   *       }
   *     }
   *   }
   * })
   */
  kotlinVersion: (content: string, config: BuildConfig): string => {
    if (!config.android.gradle?.projectGradle?.kotlinVersion) return content;

    return string.replace(
      content,
      /(kotlinVersion\s+=\s+").*(")/m,
      `$1${config.android.gradle.projectGradle.kotlinVersion}$2`,
    );
  },
};
