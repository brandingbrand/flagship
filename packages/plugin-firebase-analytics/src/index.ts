import { fsk, path } from "@brandingbrand/kernel-core";

import type { KernelPluginFirebaseAnalytics } from "./types";

const ios = async (config: KernelPluginFirebaseAnalytics) => {
  if (config.kernelPluginFirebaseAnalytics.kernel.ios?.disableAdId) {
    await fsk.update(
      path.ios.podfilePath(),
      /(platform :[\s\S]+?\n)/,
      `$1
$RNFirebaseAnalyticsWithoutAdIdSupport = true\n`
    );
  }
};

const android = () => {
  //
};

export * from "./types";

export { ios, android };
