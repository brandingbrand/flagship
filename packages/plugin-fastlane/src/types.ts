import type { Plugin } from "@brandingbrand/kernel-core";

export interface KernelPluginFastlane {
  kernelPluginFastlane: Plugin<PluginFastlane>;
}
export interface PluginFastlane {
  ios?: FastlaneIOS;
  android?: FastlaneAndroid;
}

interface AppCenterIOS {
  organization: string;
  appName: string;
  destinationType: string;
  destinations: string[];
}

interface FastlaneIOS {
  appCenter: AppCenterIOS;
  buildScheme: string;
}

interface AppCenterAndroid {
  organization: string;
  appName: string;
  destinationType: string;
  destinations: string[];
}

interface FastlaneAndroid {
  appCenter: AppCenterAndroid;
}
