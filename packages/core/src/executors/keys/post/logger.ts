/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { spinner } from "../../../utils";

import type { Config } from "../../../types/types";
import type { KeysOptions } from "../../../types/options";

export const execute = async (options: KeysOptions, config: Config) => {
  if (!options.verbose) {
    spinner.stop();
  }
};
