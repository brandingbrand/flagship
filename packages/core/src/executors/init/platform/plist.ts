import { withSummary } from "../../../utils/summary";
import { setPlist, setUrlScheme } from "../../../utils/ios/info-plist";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = (options: InitOptions, config: Config) => {
  return {
    ios: withSummary(
      async () => {
        if (!config.ios.plist) return;

        const { urlScheme, ...restPlist } = config.ios.plist;

        if (urlScheme) {
          await setUrlScheme(
            urlScheme.host
              ? `${urlScheme.scheme}://${urlScheme.host}`
              : urlScheme.scheme,
            config
          );
        }

        if (restPlist) {
          await setPlist(restPlist, config);
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
