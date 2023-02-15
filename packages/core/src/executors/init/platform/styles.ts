import { styles } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = (options: InitOptions, config: Config) => ({
  ios: async () => {
    //
  },
  android: withSummary(
    async () => {
      if (config.android.styles?.appThemeAttributes) {
        await styles.setAppThemeAttributes(
          config.android.styles.appThemeAttributes
        );
      }

      if (config.android.styles?.appThemeElements) {
        await styles.addAppThemeElements(
          config.android.styles.appThemeElements
        );
      }
    },
    "styles",
    "platform::android"
  ),
});
