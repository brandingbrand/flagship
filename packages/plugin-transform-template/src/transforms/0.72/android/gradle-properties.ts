import {BuildConfig, string} from '@brandingbrand/code-cli-kit';

/**
 * Configuration object for Android Gradle properties
 */
export default {
  /** Regular expression to match gradle.properties files */
  __test: /\bgradle\.properties$/gm,

  /**
   * Updates the android.useAndroidX property in gradle.properties
   * @param content The current content of gradle.properties
   * @param config Build configuration object containing Android settings
   * @returns Updated gradle.properties content
   */
  useAndroidX: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.properties?.useAndroidX === undefined)
      return content;

    return string.replace(
      content,
      /(android\.useAndroidX=).*/m,
      `$1${config.android.gradle.properties.useAndroidX}`,
    );
  },

  /**
   * Updates the android.enableJetifier property in gradle.properties
   * @param content The current content of gradle.properties
   * @param config Build configuration object containing Android settings
   * @returns Updated gradle.properties content
   */
  enableJetifier: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.properties?.enableJetifier === undefined)
      return content;

    return string.replace(
      content,
      /(android\.enableJetifier=).*/m,
      `$1${config.android.gradle.properties.enableJetifier}`,
    );
  },

  /**
   * Updates the FLIPPER_VERSION property in gradle.properties
   * @param content The current content of gradle.properties
   * @param config Build configuration object containing Android settings
   * @returns Updated gradle.properties content
   */
  flipperVersion: (content: string, config: BuildConfig): string => {
    if (!config.android.gradle?.properties?.FLIPPER_VERSION) return content;

    return string.replace(
      content,
      /(FLIPPER_VERSION=).*/m,
      `$1${config.android.gradle.properties.FLIPPER_VERSION}`,
    );
  },

  /**
   * Updates the reactNativeArchitectures property in gradle.properties
   * @param content The current content of gradle.properties
   * @param config Build configuration object containing Android settings
   * @returns Updated gradle.properties content
   */
  reactNativeArchitectures: (content: string, config: BuildConfig): string => {
    if (!config.android.gradle?.properties?.reactNativeArchitectures)
      return content;

    return string.replace(
      content,
      /(reactNativeArchitectures=).*/m,
      `$1${config.android.gradle.properties.reactNativeArchitectures}`,
    );
  },

  /**
   * Updates the newArchEnabled property in gradle.properties
   * @param content The current content of gradle.properties
   * @param config Build configuration object containing Android settings
   * @returns Updated gradle.properties content
   */
  newArchEnabled: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.properties?.newArchEnabled === undefined)
      return content;

    return string.replace(
      content,
      /(newArchEnabled=).*/m,
      `$1${config.android.gradle.properties.newArchEnabled}`,
    );
  },

  /**
   * Updates the hermesEnabled property in gradle.properties
   * @param content The current content of gradle.properties
   * @param config Build configuration object containing Android settings
   * @returns Updated gradle.properties content
   */
  hermesEnabled: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.properties?.hermesEnabled === undefined)
      return content;

    return string.replace(
      content,
      /(hermesEnabled=).*/m,
      `$1${config.android.gradle.properties.hermesEnabled}`,
    );
  },
};
