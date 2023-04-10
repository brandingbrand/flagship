import {
  path,
  packageManager,
  spinner,
  summary,
  writable,
} from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = summary.withSummary(
  async (options: Options.InitOptions, config: Config) => {
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
