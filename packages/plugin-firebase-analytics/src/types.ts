import type { Plugin } from "@brandingbrand/code-core";

interface PluginFirebaseAnalytics {
  ios?: {
    disableAdId?: boolean;
  };
}

export interface CodePluginFirebaseAnalytics {
  codePluginFirebaseAnalytics: Plugin<PluginFirebaseAnalytics>;
}
