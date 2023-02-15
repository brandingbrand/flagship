import { fsk, path, summary } from "@brandingbrand/kernel-core";

import type { KernelPluginFirebaseAnalytics } from "./types";

const ios = summary.withSummary(
  async (config: KernelPluginFirebaseAnalytics) => {
    if (config.kernelPluginFirebaseAnalytics.kernel.ios?.disableAdId) {
      await fsk.update(
        path.ios.podfilePath(),
        /(platform :[\s\S]+?\n)/,
        `$1
$RNFirebaseAnalyticsWithoutAdIdSupport = true\n`
      );
    }
  },
  "plugin-firebase-analytics",
  "platform::ios"
);

const android = summary.withSummary(
  async () => {
    //
  },
  "plugin-firebase-analytics",
  "platform::android"
);

export * from "./types";

export { ios, android };
