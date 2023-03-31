import { path, rimraf } from "../../../utils";

import type { Config } from "../../../types/Config";
import type { CleanOptions } from "../../../types/Options";

export const execute = (options: CleanOptions, config: Config) => ({
  ios: async () => {
    await rimraf.async(path.project.resolve("ios"), {});
  },
  android: async () => {
    await rimraf.async(path.project.resolve("android"), {});
  },
});
