import {BuildConfig, string} from '@brandingbrand/code-cli-kit';

import gradleProperties072 from '../../0.72/android/gradle-properties';

/**
 * Configuration object for managing Android Gradle properties, extending properties from React Native 0.72
 *
 * @remarks
 * This configuration handles transformations of the gradle.properties file to enable/disable
 * specific Android build features and settings
 */
export default {
  ...gradleProperties072,

  /**
   * Updates the newArchEnabled property in gradle.properties to enable/disable the new React Native architecture
   *
   * @param content - The current content of gradle.properties file as a string
   * @param config - Build configuration object containing Android settings
   * @param config.android.gradle.properties.newArchEnabled - Boolean flag indicating whether new architecture should be enabled.
   *                                                         Defaults to false if not specified.
   * @returns Updated gradle.properties content with modified newArchEnabled setting
   *
   * @example
   * ```ts
   * // Example config object
   * const config = {
   *   android: {
   *     gradle: {
   *       properties: {
   *         newArchEnabled: true
   *       }
   *     }
   *   }
   * };
   * ```
   */
  newArchEnabled: (content: string, config: BuildConfig): string => {
    return string.replace(
      content,
      /(newArchEnabled=).*/m,
      `$1${!!config.android.gradle?.properties?.newArchEnabled}`,
    );
  },
};
