import { strings } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

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
