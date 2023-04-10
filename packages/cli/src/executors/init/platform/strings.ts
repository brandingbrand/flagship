import { strings, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.InitOptions, config: Config) => ({
  ios: async () => {
    //
  },
  android: summary.withSummary(
    async () => {
      if (config.android.strings) {
        await strings.addResourcesElements(config.android.strings);
      }
    },
    "strings",
    "platform::android"
  ),
});
