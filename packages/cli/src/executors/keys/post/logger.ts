import { spinner, writable } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = async (options: Options.KeysOptions, config: Config) => {
  if (options.verbose) return;

  spinner.stop();
  writable.restore();
};
