import { spinner } from "../../../utils";

import type { Config } from "../../../types/Config";
import type { KeysOptions } from "../../../types/Options";

export const execute = async (options: KeysOptions, config: Config) => {
  if (!options.verbose) {
    spinner.stop();
  }
};
