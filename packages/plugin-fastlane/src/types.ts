import type { Plugin } from "@brandingbrand/code-cli-kit";

/**
 * Represents the fastlane configuration for a code plugin.
 * This type specifies the configuration required for the code plugin fastlane.
 */
export type CodePluginFastlane = {
  codePluginFastlane: Plugin<{ ios?: FastlaneIOS; android?: FastlaneAndroid }>;
};

type AppCenterIOS = {
  organization: string;
  appName: string;
  destinationType: "group" | "store";
  destinations: string[];
};

type FastlaneIOS = {
  appCenter: AppCenterIOS;
  buildScheme: string;
};

type AppCenterAndroid = {
  organization: string;
  appName: string;
  destinationType: "group" | "store";
  destinations: string[];
};

type FastlaneAndroid = {
  appCenter: AppCenterAndroid;
};
