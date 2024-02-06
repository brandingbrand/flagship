import type { UrlScheme } from "./universal";

/**
 * Represents the configuration options for Android builds.
 */
export interface Android {
  /**
   * App package name.
   */
  packageName: string;
  /**
   * Android app display name.
   */
  displayName: string;
  /**
   * Gradle configuration.
   */
  gradle?: Gradle;
  /**
   * AndroidManifest.xml configuration.
   */
  manifest?: {
    urlScheme: UrlScheme;
  };
  /**
   * Signing configuration.
   */
  signing?: AndroidSigning;
  /**
   * App version configuration.
   */
  versioning?: AndroidVersion;
  /**
   * Gemfile dependencies.
   */
  gemfile?: string[];
  /**
   * Android colors.xml configuration.
   */
  colors?: Colors;
  /**
   * Android style configuration.
   */
  style?: "light" | "dark" | "system";
  /**
   * Android strings.xml configuration.
   */
  strings?: Strings;
}

/**
 * Represents the version information for an Android app.
 */
export interface AndroidVersion {
  /**
   * App version (versionName).
   */
  version: string;
  /**
   * App build number (versionCode).
   */
  build?: number;
}

/**
 * Represents the signing configuration for Android.
 */
export interface AndroidSigning {
  /**
   * Key alias for signing.
   */
  keyAlias: string;
  /**
   * Store file for signing.
   */
  storeFile: string;
}

/**
 * Represents the Gradle configuration options.
 */
export interface Gradle {
  /**
   * Configuration options for app/build.gradle.
   */
  appGradle?: AppGradle;
  /**
   * Configuration options for build.gradle.
   */
  projectGradle?: ProjectGradle;
  /**
   * Configuration options for gradle.properties.
   */
  properties?: PropertiesGradle;
}

/**
 * Represents configuration options for app/build.gradle.
 */
export interface AppGradle {
  /**
   * Additional dependencies.
   */
  dependencies?: string[];
}

/**
 * Represents configuration options for build.gradle.
 */
export interface ProjectGradle {
  /**
   * Android build tools version.
   */
  buildToolsVersion?: string;
  /**
   * Android compile SDK version.
   */
  compileSdkVersion?: number;
  /**
   * Minimum supported Android SDK version.
   */
  minSdkVersion?: number;
  /**
   * Specified NDK version.
   */
  ndkVersion?: string;
  /**
   * Additional repository search paths.
   */
  repositories?: string[];
  /**
   * Android target SDK version.
   */
  targetSdkVersion?: number;
  /**
   * Ext config.
   */
  ext?: string[];
  /**
   * Dependencies.
   */
  dependencies?: string[];
}

/**
 * Represents configuration options for gradle.properties.
 */
export interface PropertiesGradle {
  /**
   * Flag to enable AndroidX package structure.
   */
  useAndroidX?: boolean;
  /**
   * Flag to enable Jetifier for third-party libraries.
   */
  enableJetifier?: boolean;
  /**
   * Version of Flipper SDK to use with React Native.
   */
  FLIPPER_VERSION?: string;
  /**
   * Architectures to build for React Native.
   */
  reactNativeArchitectures?: string;
  /**
   * Flag to enable new architecture support.
   */
  newArchEnabled?: boolean;
  /**
   * Flag to enable Hermes JS engine.
   */
  hermesEnabled?: boolean;
}

/**
 * Represents a collection of color values.
 */
export type Colors = {
  [colorName: string]: string;
};

/**
 * Represents a collection of string resources including regular strings, string arrays, and plurals.
 */
export type Strings = {
  /**
   * Regular string resources.
   */
  string?: { [stringName: string]: string };
  /**
   * String array resources.
   */
  stringArray?: { [stringArrayName: string]: string[] };
  /**
   * Plural resources with different quantities.
   */
  plurals?: {
    [pluralsName: string]: Array<{
      /** Quantity of the plural resource. */
      quantity: "zero" | "one" | "two" | "few" | "many" | "other";
      /** Value of the plural resource. */
      value: string;
    }>;
  };
};
