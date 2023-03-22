import { spinner, writable } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = withSummary(
  async (options: InitOptions, config: Config) => {
    if (options.verbose) return;

    spinner.stop();

    writable.restore();
  },
  "logger",
  "post"
);
