import { fs, path, rimraf, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.CleanOptions, config: Config) => ({
  ios: summary.withSummary(
    async () => {
      if (await fs.pathExists(path.project.resolve("ios"))) {
        await rimraf.async(path.project.resolve("ios"), {});
      }
    },
    "clean",
    "platform::ios"
  ),
  android: summary.withSummary(
    async () => {
      if (await fs.pathExists(path.project.resolve("android"))) {
        await rimraf.async(path.project.resolve("android"), {});
      }
    },
    "clean",
    "platform::android"
  ),
});
