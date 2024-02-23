import type { Plugin } from "@brandingbrand/code-cli-kit";

/**
 * Represents the fastlane configuration for a code plugin.
 * This type specifies the configuration required for the code plugin fastlane.
 */
export type CodePluginFastlane = {
  /**
   * Specifies the configuration for the code plugin fastlane.
   */
  codePluginFastlane: Plugin<{ ios?: FastlaneIOS; android?: FastlaneAndroid }>;
};

/**
 * Represents the configuration for App Center for iOS.
 */
type AppCenterIOS = {
  /**
   * The organization name in App Center.
   */
  organization: string;

  /**
   * The name of the app in App Center.
   */
  appName: string;

  /**
   * The type of distribution destination.
   */
  destinationType: "group" | "store";

  /**
   * Array of distribution destinations.
   */
  destinations: string[];
};

/**
 * Represents the configuration for Fastlane specific to iOS.
 */
type FastlaneIOS = {
  /**
   * Configuration for App Center for iOS.
   */
  appCenter?: AppCenterIOS;
};

/**
 * Represents the configuration for App Center for Android.
 */
type AppCenterAndroid = {
  /**
   * The organization name in App Center.
   */
  organization: string;

  /**
   * The name of the app in App Center.
   */
  appName: string;

  /**
   * The type of distribution destination.
   */
  destinationType: "group" | "store";

  /**
   * Array of distribution destinations.
   */
  destinations: string[];
};

/**
 * Represents the configuration for Fastlane specific to Android.
 */
type FastlaneAndroid = {
  /**
   * Configuration for App Center for Android.
   */
  appCenter?: AppCenterAndroid;
};
