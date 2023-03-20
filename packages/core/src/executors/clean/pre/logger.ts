import { spinner } from "../../../utils";

import type { Config } from "../../../types/types";
import type { CleanOptions } from "../../../types/options";

export const execute = async (options: CleanOptions, config: Config) => {
  if (!options.verbose) {
    spinner.start("Cleaning the app");

    //@ts-ignore
    process.stdout.write = function () {};
  }
};
