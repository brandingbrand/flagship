import {BuildConfig, string} from '@brandingbrand/code-cli-kit';

/**
 * Configuration object for Android build.gradle file modifications
 */
export default {
  /**
   * Regular expression to match Android build.gradle files
   */
  // This regex has an escaped forward slash that ESLint flags, but it's needed
  // to properly match android folder paths on both Windows and Unix systems
  // eslint-disable-next-line no-useless-escape
  __test: /\bandroid\/[^\/]+\/build\.gradle$/gm,

  /**
   * Updates the namespace in build.gradle with the configured package name
   * @param content - The original build.gradle content
   * @param config - The build configuration object
   * @returns The modified build.gradle content with updated namespace
   */
  namespace: (content: string, config: BuildConfig): string => {
    return string.replace(
      content,
      /(namespace\s*")(\w|\.)+(")/m,
      `$1${config.android.packageName}$3`,
    );
  },

  /**
   * Updates the applicationId in build.gradle with the configured package name
   * @param content - The original build.gradle content
   * @param config - The build configuration object
   * @returns The modified build.gradle content with updated applicationId
   */
  applicationId: (content: string, config: BuildConfig): string => {
    return string.replace(
      content,
      /(applicationId\s*")(\w|\.)+(")/m,
      `$1${config.android.packageName}$3`,
    );
  },

  /**
   * Updates the versionCode in build.gradle with the configured build number
   * @param content - The original build.gradle content
   * @param config - The build configuration object
   * @returns The modified build.gradle content with updated versionCode
   */
  versionCode: (content: string, config: BuildConfig): string => {
    if (!config.android.versioning?.build) return content;

    return string.replace(
      content,
      /(versionCode\s+)\d+/m,
      `$1${config.android.versioning?.build}`,
    );
  },

  /**
   * Updates the versionName in build.gradle with the configured version
   * @param content - The original build.gradle content
   * @param config - The build configuration object
   * @returns The modified build.gradle content with updated versionName
   */
  versionName: (content: string, config: BuildConfig): string => {
    if (!config.android.versioning?.version) return content;

    return string.replace(
      content,
      /(versionName\s*")(\w|\.)+(")/m,
      `$1${config.android.versioning?.version}$3`,
    );
  },

  /**
   * Adds signing configuration to build.gradle for release builds
   * @param content - The original build.gradle content
   * @param config - The build configuration object
   * @returns The modified build.gradle content with signing configuration
   */
  signingConfig: (content: string, config: BuildConfig): string => {
    if (!config.android.signing) return content;

    return string.replace(
      content,
      /(signingConfigs\s*{\s*)/m,
      `$1release {
              storeFile file('release.keystore')
              storePassword System.getenv("STORE_PASSWORD")
              keyAlias '${config.android.signing.keyAlias}'
              keyPassword System.getenv("KEY_PASSWORD")
          }
          `,
    );
  },

  /**
   * Updates the release build type to use the signing configuration
   * @param content - The original build.gradle content
   * @param config - The build configuration object
   * @returns The modified build.gradle content with updated build type
   */
  buildType: (content: string, config: BuildConfig): string => {
    if (!config.android.signing) return content;

    return string.replace(
      content,
      /(buildTypes\s*{[\s\S]*release\s*{[\s\S]*signingConfig\s+).*/m,
      '$1signingConfigs.release',
    );
  },

  /**
   * Adds additional dependencies to build.gradle from the configuration
   * @param content - The original build.gradle content
   * @param config - The build configuration object
   * @returns The modified build.gradle content with added dependencies
   */
  dependencies: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.appGradle?.dependencies === undefined)
      return content;

    return string.replace(
      content,
      /(dependencies\s*{\s*?\n(\s+))/m,
      `$1${config.android.gradle.appGradle.dependencies.map(it => it).join('\n$2')}\n$2`,
    );
  },
};
