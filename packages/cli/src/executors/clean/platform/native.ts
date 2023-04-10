import { path, rimraf } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.CleanOptions, config: Config) => ({
  ios: async () => {
    await rimraf.async(path.project.resolve("ios"), {});
  },
  android: async () => {
    await rimraf.async(path.project.resolve("android"), {});
  },
});
