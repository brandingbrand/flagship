import type { Plugin } from "@brandingbrand/code-core";

interface PluginLeanplum {
  ios?: {
    swizzle?: boolean;
  };
  android?: {
    leanplumFCMVersion: string;
    notificationColor: string;
  };
}

export interface CodePluginLeanplum {
  codePluginLeanplum?: Plugin<PluginLeanplum>;
}
