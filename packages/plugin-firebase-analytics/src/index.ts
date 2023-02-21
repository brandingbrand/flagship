import { fsk, path, summary } from "@brandingbrand/code-core";

import type { CodePluginFirebaseAnalytics } from "./types";

const ios = summary.withSummary(
  async (config: CodePluginFirebaseAnalytics) => {
    if (config.codePluginFirebaseAnalytics.plugin.ios?.disableAdId) {
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
