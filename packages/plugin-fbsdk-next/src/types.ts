import { Plugin } from "@brandingbrand/kernel-core";

interface PluginFBSDKNext {
  ios?: {
    urlScheme: string;
    appId: string;
    clientToken: string;
    displayName: string;
    queriesSchemes?: string[];
  };
  android?: {
    appId: string;
    clientToken: string;
    advertisingIdOptOut?: boolean;
    enableSharing?: boolean;
  };
}

export interface KernelPluginFBSDKNext {
  kernelPluginFBSDKNext: Plugin<PluginFBSDKNext>;
}
