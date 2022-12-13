import type { Plugin } from "@brandingbrand/kernel-core";

interface PluginFirebaseAnalytics {
  ios?: {
    disableAdId?: boolean;
  };
}

export interface KernelPluginFirebaseAnalytics {
  kernelPluginFirebaseAnalytics: Plugin<PluginFirebaseAnalytics>;
}
