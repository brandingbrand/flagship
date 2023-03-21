import { Xcode, fs, path } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = (options: InitOptions, config: Config) => {
  return {
    ios: withSummary(
      async () => {
        if (config.ios.frameworks) {
          const xcode = new Xcode(config);

          for (const framework of config.ios.frameworks) {
            if (framework.path) {
              const source = path.config.resolve(
                framework.path,
                framework.framework
              );
              const destination = path.resolve(
                path.ios.nativeProjectPath(config),
                framework.framework
              );
              await fs.copy(source, destination);

              xcode.addFramework(destination, { customFramework: true });
            } else {
              xcode.addFramework(framework.framework, {});
            }
          }

          await xcode.build();
        }
      },
      "frameworks",
      "platform::ios"
    ),
    android: async () => {
      //
    },
  };
};
