import { strings } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = (options: InitOptions, config: Config) => ({
  ios: async () => {
    //
  },
  android: withSummary(
    async () => {
      if (config.android.strings) {
        await strings.addResourcesElements(config.android.strings);
      }
    },
    "strings",
    "platform::android"
  ),
});
