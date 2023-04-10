import { fs, path, summary, Xcode } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.InitOptions, config: Config) => {
  return {
    ios: summary.withSummary(
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
