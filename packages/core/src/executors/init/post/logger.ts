/* eslint-disable @typescript-eslint/no-unused-vars */

import { fs, fsk, path, spinner, writable } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = withSummary(
  async (options: InitOptions, config: Config) => {
    if (options.verbose) return;

    spinner.stop();

    writable.restore();
  },
  "logger",
  "post"
);
