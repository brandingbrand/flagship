import {BuildConfig, string} from '@brandingbrand/code-cli-kit';

import gradleProperties077 from '../../0.77/android/gradle-properties';

/**
 * Configuration object for managing Android Gradle properties, extending properties from React Native 0.72
 *
 * @remarks
 * This configuration handles transformations of the gradle.properties file to enable/disable
 * specific Android build features and settings
 */
export default {
  ...gradleProperties077,

  /**
   * Updates the edgeToEdgeEnabled property in gradle.properties to enable/disable the new edge-to-edge display mode.
   *
   * @param content - The current content of gradle.properties file as a string
   * @param config - Build configuration object containing Android settings
   * @param config.android.gradle.properties.edgeToEdgeEnabled - Boolean flag indicating whether edge-to-edge mode should be enabled.
   *                                                             Defaults to false if not specified.
   * @returns Updated gradle.properties content with modified newArchEnabled setting
   *
   * @example
   * ```ts
   * // Example config object
   * const config = {
   *   android: {
   *     gradle: {
   *       properties: {
   *         edgeToEdgeEnabled: true
   *       }
   *     }
   *   }
   * };
   * ```
   */
  edgeToEdgeEnabled: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.properties?.edgeToEdgeEnabled === undefined)
      return content;
    return string.replace(
      content,
      /(edgeToEdgeEnabled=).*/m,
      `$1${!!config.android.gradle?.properties?.edgeToEdgeEnabled}`,
    );
  },
};
