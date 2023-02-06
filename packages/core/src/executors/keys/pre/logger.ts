/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { spinner } from "../../../utils";

import type { Config } from "../../../types/types";
import type { KeysOptions } from "../../../types/options";

export const execute = async (options: KeysOptions, config: Config) => {
  if (!options.verbose) {
    spinner.start("Adding keys to the app");

    //@ts-ignore
    process.stdout.write = function () {};
  }
};
