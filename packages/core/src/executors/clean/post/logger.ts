import { spinner } from "../../../utils";

import type { Config } from "../../../types/Config";
import type { CleanOptions } from "../../../types/Options";

export const execute = async (options: CleanOptions, config: Config) => {
  if (!options.verbose) {
    spinner.stop();
  }
};
