import type { Plugin } from "@brandingbrand/code-cli-kit";

export type CodePluginFBSDKNext = {
  codePluginFBSDKNext: Plugin<{
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
  }>;
};
