/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { fs, fsk, path, spinner } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = withSummary(
  async (options: InitOptions, config: Config) => {
    if (!options.verbose) {
      if (
        await fs.pathExists(
          path.project.resolve("node_modules", "npmlog", "log.js")
        )
      ) {
        await fsk.update(
          path.project.resolve("node_modules", "npmlog", "log.js"),
          /(log.level =[\s\S]+?\n)/,
          "log.level = 'info'\n"
        );
      }

      spinner.stop();
    }
  },
  "logger",
  "post"
);
