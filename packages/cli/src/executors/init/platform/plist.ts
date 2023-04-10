import { infoPlist, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.InitOptions, config: Config) => {
  return {
    ios: summary.withSummary(
      async () => {
        if (!config.ios.plist) return;

        const { urlScheme, ...restPlist } = config.ios.plist;

        if (urlScheme) {
          await infoPlist.setUrlScheme(
            urlScheme.host
              ? `${urlScheme.scheme}://${urlScheme.host}`
              : urlScheme.scheme,
            config
          );
        }

        if (restPlist) {
          await infoPlist.setPlist(restPlist, config);
        }
      },
      "plist",
      "platform::ios"
    ),
    android: async () => {
      //
    },
  };
};
