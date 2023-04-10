import { spinner } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = async (
  options: Options.CleanOptions,
  config: Config
) => {
  if (!options.verbose) {
    spinner.start("Cleaning the app");

    //@ts-ignore
    process.stdout.write = function () {};
  }
};
