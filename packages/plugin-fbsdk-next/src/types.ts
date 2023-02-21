import { Plugin } from "@brandingbrand/code-core";

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

export interface CodePluginFBSDKNext {
  codePluginFBSDKNext: Plugin<PluginFBSDKNext>;
}
