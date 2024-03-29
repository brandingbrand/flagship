import { fs, path, rimraf } from "../../../utils";

import type { Config } from "../../../types/Config";
import type { CleanOptions } from "../../../types/Options";
import { withSummary } from "../../../utils/summary";

export const execute = (options: CleanOptions, config: Config) => ({
  ios: withSummary(
    async () => {
      if (await fs.pathExists(path.project.resolve("ios"))) {
        await rimraf.async(path.project.resolve("ios"), {});
      }
    },
    "clean",
    "platform::ios"
  ),
  android: withSummary(
    async () => {
      if (await fs.pathExists(path.project.resolve("android"))) {
        await rimraf.async(path.project.resolve("android"), {});
      }
    },
    "clean",
    "platform::android"
  ),
});
