import { styles, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.InitOptions, config: Config) => ({
  ios: async () => {
    //
  },
  android: summary.withSummary(
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
