import { networkSecurityConfig } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = (options: InitOptions, config: Config) => ({
  ios: async () => {
    //
  },
  android: withSummary(
    async () => {
      if (config.android.security?.["base-config"]) {
        await networkSecurityConfig.setBaseConfig(
          config.android.security["base-config"]
        );
      }

      if (config.android.security?.["debug-overrides"]) {
        await networkSecurityConfig.setDebugOverrides(
          config.android.security["debug-overrides"]
        );
      }

      if (config.android.security?.["domain-config"]) {
        await networkSecurityConfig.addDomainConfig(
          config.android.security["domain-config"]
        );
      }
    },
    "security",
    "platform::android"
  ),
});
