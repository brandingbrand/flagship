/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */

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
