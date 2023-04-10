import { path, rename, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.InitOptions, config: Config) => {
  return {
    ios: async () => {
      //
    },
    android: summary.withSummary(
      async () => {
        await rename.pkgDirectory(
          "com.helloworld",
          config.android.packageName,
          path.android.mainPath(),
          "java"
        );
        await rename.pkgDirectory(
          "com.helloworld",
          config.android.packageName,
          path.android.debugPath(),
          "java"
        );
      },
      "packages",
      "platform::android"
    ),
  };
};
