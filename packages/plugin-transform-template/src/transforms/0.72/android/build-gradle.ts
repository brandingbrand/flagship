import {BuildConfig, string} from '@brandingbrand/code-cli-kit';

/**
 * Configuration object for Android Gradle build settings
 */
export default {
  /** Regular expression to match Android build.gradle files */
  __test: /\bandroid\/build\.gradle$/gm,

  /**
   * Updates the buildToolsVersion in the Gradle build file
   * @param content - The original build.gradle file content
   * @param config - The build configuration object
   * @returns Updated file content with new buildToolsVersion if specified
   */
  buildToolsVersion: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.projectGradle?.buildToolsVersion === undefined)
      return content;

    return string.replace(
      content,
      /(buildToolsVersion\s*=\s*")(\d|.)+(")/m,
      `$1${config.android.gradle.projectGradle.buildToolsVersion}$3`,
    );
  },

  /**
   * Updates the minSdkVersion in the Gradle build file
   * @param content - The original build.gradle file content
   * @param config - The build configuration object
   * @returns Updated file content with new minSdkVersion if specified
   */
  miniSdkVersion: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.projectGradle?.minSdkVersion === undefined)
      return content;

    return string.replace(
      content,
      /(minSdkVersion\s*=\s*)[\d]+/m,
      `$1${config.android.gradle.projectGradle.minSdkVersion}`,
    );
  },

  /**
   * Updates the compileSdkVersion in the Gradle build file
   * @param content - The original build.gradle file content
   * @param config - The build configuration object
   * @returns Updated file content with new compileSdkVersion if specified
   */
  compileSdkVersion: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.projectGradle?.compileSdkVersion === undefined)
      return content;

    return string.replace(
      content,
      /(compileSdkVersion\s*=\s*)[\d]+/m,
      `$1${config.android.gradle.projectGradle.compileSdkVersion}`,
    );
  },

  /**
   * Updates the targetSdkVersion in the Gradle build file
   * @param content - The original build.gradle file content
   * @param config - The build configuration object
   * @returns Updated file content with new targetSdkVersion if specified
   */
  targetSdkVersion: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.projectGradle?.targetSdkVersion === undefined)
      return content;

    return string.replace(
      content,
      /(targetSdkVersion\s*=\s*)[\d]+/m,
      `$1${config.android.gradle.projectGradle.targetSdkVersion}`,
    );
  },

  /**
   * Updates the NDK version in the Gradle build file
   * @param content - The original build.gradle file content
   * @param config - The build configuration object
   * @returns Updated file content with new ndkVersion if specified
   */
  ndkVersion: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.projectGradle?.ndkVersion === undefined)
      return content;

    return string.replace(
      content,
      /(ndkVersion\s*=\s*")(\d|.)+(")/m,
      `$1${config.android.gradle.projectGradle.ndkVersion}$3`,
    );
  },

  /**
   * Updates or adds the Kotlin version in the ext block
   * @param content - The original build.gradle file content
   * @param config - The build configuration object
   * @returns Updated file content with Kotlin version (defaults to 1.7.10)
   */
  kotlinVersion: (content: string, config: BuildConfig): string => {
    return string.replace(
      content,
      /(ext\s*{\s*?\n(\s+))/m,
      `$1kotlinVersion = "${config.android.gradle?.projectGradle?.kotlinVersion || '1.7.10'}"\n$2`,
    );
  },

  /**
   * Updates the ext block with additional properties
   * @param content - The original build.gradle file content
   * @param config - The build configuration object
   * @returns Updated file content with new ext properties if specified
   */
  ext: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.projectGradle?.ext === undefined) return content;

    return string.replace(
      content,
      /(ext\s*{\s*?\n(\s+))/m,
      `$1${config.android.gradle.projectGradle.ext.map(it => it).join('\n$2')}\n$2`,
    );
  },

  /**
   * Updates the repositories block with additional repositories
   * @param content - The original build.gradle file content
   * @param config - The build configuration object
   * @returns Updated file content with new repositories if specified
   */
  repositories: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.projectGradle?.repositories === undefined)
      return content;

    return string.replace(
      content,
      /(repositories\s*{\s*?\n(\s+))/m,
      `$1${config.android.gradle.projectGradle.repositories.map(it => it).join('\n$2')}\n$2`,
    );
  },

  /**
   * Updates the dependencies block with additional dependencies
   * @param content - The original build.gradle file content
   * @param config - The build configuration object
   * @returns Updated file content with new dependencies if specified
   */
  dependencies: (content: string, config: BuildConfig): string => {
    if (config.android.gradle?.projectGradle?.dependencies === undefined)
      return content;

    return string.replace(
      content,
      /(dependencies\s*{\s*?\n(\s+))/m,
      `$1${config.android.gradle.projectGradle.dependencies.map(it => it).join('\n$2')}\n$2`,
    );
  },
};
