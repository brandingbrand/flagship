/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { spinner } from "../../../utils";

export const execute = async (options: any, config: any, cliPath: string) => {
  if (!options.verbose) {
    spinner.stop();
  }
};
