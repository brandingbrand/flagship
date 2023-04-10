import { networkSecurityConfig, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.InitOptions, config: Config) => ({
  ios: async () => {
    //
  },
  android: summary.withSummary(
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
