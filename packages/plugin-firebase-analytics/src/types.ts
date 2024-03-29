import type { Plugin } from "@brandingbrand/code-cli-kit";

export type CodePluginFirebaseAnalytics = {
  codePluginFirebaseAnalytics: Plugin<{
    ios?: {
      disableAdId?: boolean;
    };
  }>;
};
