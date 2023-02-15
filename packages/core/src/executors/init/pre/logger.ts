/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { withSummary } from "../../../utils/summary";
import { fs, fsk, path, spinner } from "../../../utils";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = withSummary(
  async (options: InitOptions, config: Config) => {
    if (!options.verbose) {
      spinner.start("Initializing the app");

      //@ts-ignore
      process.stdout.write = function () {};

      if (
        await fs.pathExists(
          path.project.resolve("node_modules", "npmlog", "log.js")
        )
      ) {
        await fsk.update(
          path.project.resolve("node_modules", "npmlog", "log.js"),
          /(log.level =[\s\S]+?\n)/,
          "log.level = 'error'\n"
        );
      }
    }
  },
  "logger",
  "pre"
);
