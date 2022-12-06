/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { spinner } from "../../../utils";

export const execute = async (options: any, config: any) => {
  if (!options.verbose) {
    spinner.stop();
  }
};
