/* eslint-disable @typescript-eslint/no-unused-vars */

import { withSummary } from "../../../utils/summary";
import { path, packageManager, spinner, writable } from "../../../utils";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = withSummary(
  async (options: InitOptions, config: Config) => {
    if (options.verbose) return;

    spinner.start("Initializing the app");

    writable.redirect();

    await packageManager.withVersion("npmlog", async (packageVersion) => {
      if (!packageVersion) return;

      const log = require(path.project.resolve("node_modules", "npmlog"));
      log.level = "silent";
    });
  },
  "logger",
  "pre"
);
