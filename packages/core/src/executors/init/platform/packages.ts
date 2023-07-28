import { path, rename } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = (options: InitOptions, config: Config) => {
  return {
    ios: async () => {
      //
    },
    android: withSummary(
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
        await rename.pkgDirectory(
          "com.helloworld",
          config.android.packageName,
          path.android.releasePath(),
          "java"
        );
      },
      "packages",
      "platform::android"
    ),
  };
};
