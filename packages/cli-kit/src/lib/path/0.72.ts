import path from 'path';

import {type BuildConfig} from '@/@types';

let _pathToProject: string;

/**
 * The absolute path to the current working directory of the Node.js process.
 * If the cached value exists, return that value otherwise cache the current
 * working directory.
 *
 * @example
 * ```ts
 * const absolutePathToProject = projectPath();
 * ```
 *
 * @return {string} The absolute path to the project.
 */
function projectPath(): string {
  if (_pathToProject) return _pathToProject;

  _pathToProject = process.cwd();

  return _pathToProject;
}

/**
 * Resolves a path relative to the project root directory.
 *
 * @param {...string} paths - Path segments to be joined and resolved.
 * @returns {string} The resolved absolute path.
 */
export function resolvePathFromProject(...paths: string[]): string {
  return path.resolve(projectPath(), ...paths);
}

/**
 * Splits a string into an array using dot notation.
 *
 * @param {string} value - The string to be split.
 * @returns {string[]} An array of strings obtained by splitting the input string.
 */
export function packageToPath(value: string): string[] {
  return value.split('.');
}

/**
 * Extended path utility that includes additional functionality for managing
 * file paths in a React Native project. Provides convenient access to common
 * project, iOS and Android file paths.
 *
 * @module paths
 */
export default {
  /**
   * Includes all native Node.js path module functions and properties.
   * @see {@link https://nodejs.org/api/path.html Node.js Path}
   */
  ...path,

  /**
   * Project-specific path utilities for working with the root project directory.
   */
  project: {
    /**
     * Resolves a path relative to the project root directory.
     *
     * @param {...string} paths - Path segments to be joined and resolved
     * @returns {string} An absolute path with the provided segments joined to the project root
     * @example
     * paths.project.resolve('src', 'components') // Returns "/path/to/project/src/components"
     */
    resolve: resolvePathFromProject,
  },

  /**
   * Returns the absolute path to the Flagship Code™ configuration file.
   * This file contains core project settings and build configurations.
   *
   * @returns {string} Absolute path to "flagship-code.config.ts"
   */
  config: resolvePathFromProject('flagship-code.config.ts'),

  /**
   * iOS-specific path utilities for accessing key iOS project files and configurations.
   * All paths are relative to the 'ios' directory in the project root.
   */
  ios: {
    /**
     * Gets the absolute path to the iOS Podfile, which manages CocoaPods dependencies.
     *
     * @returns {string} Absolute path to "ios/Podfile"
     */
    podfile: resolvePathFromProject('ios', 'Podfile'),

    /**
     * Gets the absolute path to the iOS Info.plist, which defines key app properties.
     *
     * @returns {string} Absolute path to "ios/app/Info.plist"
     */
    infoPlist: resolvePathFromProject('ios', 'app', 'Info.plist'),

    /**
     * Gets the absolute path to the iOS Gemfile, which manages Ruby dependencies.
     *
     * @returns {string} Absolute path to "ios/app/Gemfile"
     */
    gemfile: resolvePathFromProject('ios', 'Gemfile'),

    /**
     * Gets the path to EnvSwitcher.m, which handles environment switching functionality.
     *
     * @returns {string} Absolute path to "ios/app/EnvSwitcher.m"
     */
    envSwitcher: resolvePathFromProject('ios', 'app', 'EnvSwitcher.m'),

    /**
     * Gets the path to app.entitlements, which configures iOS app capabilities.
     *
     * @returns {string} Absolute path to "ios/app/app.entitlements"
     */
    entitlements: resolvePathFromProject('ios', 'app', 'app.entitlements'),

    /**
     * Gets the path to PrivacyInfo.xcprivacy manifest file for iOS privacy features.
     *
     * @returns {string} Absolute path to "ios/app/PrivacyInfo.xcprivacy"
     */
    privacyManifest: resolvePathFromProject(
      'ios',
      'app',
      'PrivacyInfo.xcprivacy',
    ),

    /**
     * Gets the path to NativeConstants.m for iOS native constant definitions.
     *
     * @returns {string} Absolute path to "ios/app/NativeConstants.m"
     */
    nativeConstants: resolvePathFromProject('ios', 'app', 'NativeConstants.m'),

    /**
     * Gets the path to AppDelegate.mm, the main iOS application delegate.
     *
     * @returns {string} Absolute path to "ios/app/AppDelegate.mm"
     */
    appDelegate: resolvePathFromProject('ios', 'app', 'AppDelegate.mm'),

    /**
     * Gets the path to the Xcode project configuration file.
     *
     * @returns {string} Absolute path to "ios/app.xcodeproj/project.pbxproj"
     */
    projectPbxProj: resolvePathFromProject(
      'ios',
      'app.xcodeproj',
      'project.pbxproj',
    ),
  },

  /**
   * Android-specific path utilities for accessing key Android project files and configurations.
   * All paths are relative to the 'android' directory in the project root.
   */
  android: {
    /**
     * Gets the path to the root build.gradle file containing project-level build configurations.
     *
     * @returns {string} Absolute path to "android/build.gradle"
     */
    buildGradle: resolvePathFromProject('android', 'build.gradle'),

    /**
     * Gets the path to the Android Gemfile for Ruby dependency management.
     *
     * @returns {string} Absolute path to "android/Gemfile"
     */
    gemfile: resolvePathFromProject('android', 'Gemfile'),

    /**
     * Gets the path to gradle.properties containing Gradle-specific settings.
     *
     * @returns {string} Absolute path to "android/gradle.properties"
     */
    gradleProperties: resolvePathFromProject('android', 'gradle.properties'),

    /**
     * Gets the path to the app-level build.gradle file for module-specific configurations.
     *
     * @returns {string} Absolute path to "android/app/build.gradle"
     */
    appBuildGradle: resolvePathFromProject('android', 'app', 'build.gradle'),

    /**
     * Gets the path to AndroidManifest.xml containing core app declarations.
     *
     * @returns {string} Absolute path to "android/app/src/main/AndroidManifest.xml"
     */
    androidManifest: resolvePathFromProject(
      'android',
      'app',
      'src',
      'main',
      'AndroidManifest.xml',
    ),

    /**
     * Gets the path to colors.xml defining app color resources.
     *
     * @returns {string} Absolute path to "android/app/src/main/res/values/colors.xml"
     */
    colors: resolvePathFromProject(
      'android',
      'app',
      'src',
      'main',
      'res',
      'values',
      'colors.xml',
    ),

    /**
     * Gets the path to strings.xml containing app string resources.
     *
     * @returns {string} Absolute path to "android/app/src/main/res/values/strings.xml"
     */
    strings: resolvePathFromProject(
      'android',
      'app',
      'src',
      'main',
      'res',
      'values',
      'strings.xml',
    ),

    /**
     * Gets the path to styles.xml defining app style resources.
     *
     * @returns {string} Absolute path to "android/app/src/main/res/values/styles.xml"
     */
    styles: resolvePathFromProject(
      'android',
      'app',
      'src',
      'main',
      'res',
      'values',
      'styles.xml',
    ),

    /**
     * Gets the path to MainApplication.java, the primary Application class.
     *
     * @param {BuildConfig} config - Android build configuration containing package information
     * @returns {string} Absolute path to MainApplication.java in the app package directory
     * @example
     * paths.android.mainApplication({android: {packageName: 'com.example.app'}})
     */
    mainApplication: function (config: BuildConfig): string {
      return resolvePathFromProject(
        'android',
        'app',
        'src',
        'main',
        'java',
        ...packageToPath(config.android.packageName),
        'MainApplication.java',
      );
    },

    /**
     * Gets the path to MainActivity.java, the main activity class.
     *
     * @param {BuildConfig} config - Android build configuration containing package information
     * @returns {string} Absolute path to MainActivity.java in the app package directory
     */
    mainActivity: function (config: BuildConfig): string {
      return resolvePathFromProject(
        'android',
        'app',
        'src',
        'main',
        'java',
        ...packageToPath(config.android.packageName),
        'MainActivity.java',
      );
    },

    /**
     * Gets the path to EnvSwitcher.java for environment management.
     *
     * @param {BuildConfig} config - Android build configuration containing package information
     * @returns {string} Absolute path to EnvSwitcher.java in the app package directory
     */
    envSwitcher: function (config: BuildConfig): string {
      return resolvePathFromProject(
        'android',
        'app',
        'src',
        'main',
        'java',
        ...packageToPath(config.android.packageName),
        'EnvSwitcher.java',
      );
    },

    /**
     * Gets the path to NativeConstants.java containing Android native constants.
     *
     * @param {BuildConfig} config - Android build configuration containing package information
     * @returns {string} Absolute path to NativeConstants.java in the app package directory
     */
    nativeConstants: function (config: BuildConfig): string {
      return resolvePathFromProject(
        'android',
        'app',
        'src',
        'main',
        'java',
        ...packageToPath(config.android.packageName),
        'NativeConstants.java',
      );
    },
  },
};
