import { path, rimraf } from "../../../utils";

import type { Config } from "../../../types/Config";
import type { CleanOptions } from "../../../types/Options";

export const execute = async (options: CleanOptions, config: Config) => {
  await rimraf.async(`${path.config.envPath()}/**/*.js`, {});
};
