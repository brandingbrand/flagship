import { fs, path, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.InitOptions, config: Config) => {
  return {
    ios: summary.withSummary(
      async () => {
        if (config.ios.entitlementsFilePath) {
          await fs.copyFile(
            path.config.resolve(config.ios.entitlementsFilePath),
            path.project.resolve(
              "ios",
              config.ios.name,
              `${config.ios.name}.entitlements`
            )
          );
        }
      },
      "entitlements",
      "platform::ios"
    ),
    android: async () => {
      //
    },
  };
};
