import { fs, path } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = (options: InitOptions, config: Config) => {
  return {
    ios: withSummary(
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
