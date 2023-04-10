import { path, rimraf } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = async (options: Options.InitOptions, config: Config) => {
  await rimraf.async(`${path.config.envPath()}/**/*.js`, {});
};
