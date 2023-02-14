import { setPlist, setUrlScheme } from "../../../utils/ios/info-plist";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = (options: InitOptions, config: Config) => {
  return {
    ios: async () => {
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
    android: async () => {
      //
    },
  };
};
