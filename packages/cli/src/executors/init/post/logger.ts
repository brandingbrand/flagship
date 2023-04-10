import { spinner, summary, writable } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = summary.withSummary(
  async (options: Options.InitOptions, config: Config) => {
    if (options.verbose) return;

    spinner.stop();

    writable.restore();
  },
  "logger",
  "post"
);
