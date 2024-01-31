import path from "path";
import type { BuildConfig } from "@/@types";

/**
 * The absolute path to the current working directory of the Node.js process.
 */
const projectPath = process.cwd();

/**
 * Resolves a path relative to the project root directory.
 *
 * @param {...string} paths - Path segments to be joined and resolved.
 * @returns {string} The resolved absolute path.
 */
export function resolvePathFromProject(...paths: string[]): string {
  return path.resolve(projectPath, ...paths);
}

/**
 * Splits a string into an array using dot notation.
 *
 * @param {string} value - The string to be split.
 * @returns {string[]} An array of strings obtained by splitting the input string.
 */
function packageToPath(value: string): string[] {
  return value.split(".");
}

/**
 * A configuration object providing paths for various project-related files and directories.
 */
export const paths = {
  /**
   * Retrieves the absolute path to the flagship-code configuration file.
   *
   * @returns {string} The absolute path to "flagship-code.config.ts".
   */
  config: function (): string {
    return path.resolve(projectPath, "flagship-code.config.ts");
  },
  /**
   *
   */
  project: {
    resolve: resolvePathFromProject,
  },
  /**
   * Retrieves the absolute path to the project package.json file.
   *
   * @returns {string} The absolute path to "package.json".
   */
  packageJSON: function (): string {
    return path.resolve(projectPath, "package.json");
  },

  /**
   * Retrieves the absolute path to the iOS Info.plist file.
   *
   * @returns {string} The absolute path to "ios/app/Info.plist".
   */
  ios: {
    infoPlist: function (): string {
      return resolvePathFromProject("ios", "app", "Info.plist");
    },

    /**
     * Retrieves the absolute path to the iOS EnvSwitcher.m file.
     *
     * @returns {string} The absolute path to "ios/app/EnvSwitcher.m".
     */
    envSwitcher: function (): string {
      return resolvePathFromProject("ios", "app", "EnvSwitcher.m");
    },

    /**
     * Retrieves the absolute path to the iOS Gemfile file.
     *
     * @returns {string} The absolute path to "ios/app/Gemfile".
     */
    gemfile: function (): string {
      return resolvePathFromProject("ios", "app", "Gemfile");
    },

    /**
     * Retrieves the absolute path to the iOS NativeConstants.m file.
     *
     * @returns {string} The absolute path to "ios/app/NativeConstants.m".
     */
    nativeConstants: function (): string {
      return resolvePathFromProject("ios", "app", "NativeConstants.m");
    },

    /**
     * Retrieves the absolute path to the iOS Podfile file.
     *
     * @returns {string} The absolute path to "ios/Podfile".
     */
    podfile: function (): string {
      return resolvePathFromProject("ios", "Podfile");
    },

    /**
     * Retrieves the absolute path to the iOS project.pbxproj file.
     *
     * @returns {string} The absolute path to "ios/app.xcodeproj/project.pbxproj".
     */
    projectPbxProj: function (): string {
      return resolvePathFromProject("ios", "app.xcodeproj", "project.pbxproj");
    },
  },

  /**
   * Retrieves the absolute path to the AndroidManifest.xml file.
   *
   * @returns {string} The absolute path to "android/app/src/main/AndroidManifest.xml".
   */
  android: {
    androidManifest: function (): string {
      return resolvePathFromProject(
        "android",
        "app",
        "src",
        "main",
        "AndroidManifest.xml"
      );
    },

    /**
     * Retrieves the absolute path to the Android app/build.gradle file.
     *
     * @returns {string} The absolute path to "android/app/build.gradle".
     */
    appBuildGradle: function (): string {
      return resolvePathFromProject("android", "app", "build.gradle");
    },

    /**
     * Retrieves the absolute path to the Android build.gradle file.
     *
     * @returns {string} The absolute path to "android/build.gradle".
     */
    buildGradle: function (): string {
      return resolvePathFromProject("android", "build.gradle");
    },

    /**
     * Retrieves the absolute path to the Android colors.xml file.
     *
     * @returns {string} The absolute path to "android/app/src/main/res/values/colors.xml".
     */
    colors: function (): string {
      return resolvePathFromProject(
        "android",
        "app",
        "src",
        "main",
        "res",
        "values",
        "colors.xml"
      );
    },

    /**
     * Retrieves the absolute path to the Android network_security_config.xml file.
     *
     * @returns {string} The absolute path to "android/app/src/main/res/xml/network_security_config.xml".
     */
    networkSecurityConfig: function (): string {
      return resolvePathFromProject(
        "android",
        "app",
        "src",
        "main",
        "res",
        "xml",
        "network_security_config.xml"
      );
    },
    /**
     * Retrieves the absolute path to the Android EnvSwitcher.java file.
     *
     * @param {BuildConfig} config - The Android project configuration.
     * @returns {string} The absolute path to the EnvSwitcher.java file.
     */
    envSwitcher: function (config: BuildConfig): string {
      return resolvePathFromProject(
        "android",
        "app",
        "src",
        "main",
        "java",
        ...packageToPath(config.android.packageName),
        "EnvSwitcher.java"
      );
    },

    /**
     * Retrieves the absolute path to the Android Gemfile file.
     *
     * @returns {string} The absolute path to "android/Gemfile".
     */
    gemfile: function (): string {
      return resolvePathFromProject("android", "Gemfile");
    },

    /**
     * Retrieves the absolute path to the Android gradle.properties file.
     *
     * @returns {string} The absolute path to "android/gradle.properties".
     */
    gradleProperties: function (): string {
      return resolvePathFromProject("android", "gradle.properties");
    },

    /**
     * Retrieves the absolute path to the Android NativeConstants.java file.
     *
     * @param {BuildConfig} config - The Android project configuration.
     * @returns {string} The absolute path to the NativeConstants.java file.
     */
    nativeConstants: function (config: BuildConfig): string {
      return resolvePathFromProject(
        "android",
        "app",
        "src",
        "main",
        "java",
        ...packageToPath(config.android.packageName),
        "NativeConstants.java"
      );
    },

    /**
     * Retrieves the absolute path to the Android strings.xml file.
     *
     * @returns {string} The absolute path to "android/app/src/main/res/values/strings.xml".
     */
    strings: function (): string {
      return resolvePathFromProject(
        "android",
        "app",
        "src",
        "main",
        "res",
        "values",
        "strings.xml"
      );
    },

    /**
     * Retrieves the absolute path to the Android styles.xml file.
     *
     * @returns {string} The absolute path to "android/app/src/main/res/values/styles.xml".
     */
    styles: function (): string {
      return resolvePathFromProject(
        "android",
        "app",
        "src",
        "main",
        "res",
        "values",
        "styles.xml"
      );
    },
  },
};
