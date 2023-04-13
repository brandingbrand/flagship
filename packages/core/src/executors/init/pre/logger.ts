import { withSummary } from "../../../utils/summary";
import { path, packageManager, spinner, writable } from "../../../utils";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = withSummary(
  async (options: InitOptions, config: Config) => {
    if (options.verbose) return;

    spinner.start("Initializing the app");

    writable.redirect();

    await packageManager.withVersion("npmlog", async (packageVersion) => {
      if (!packageVersion) return;

      const log = require(path.hoist.resolve("npmlog"));
      log.level = "silent";
    });
  },
  "logger",
  "pre"
);
