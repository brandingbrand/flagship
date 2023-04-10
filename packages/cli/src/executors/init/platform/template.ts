import path from "path";

import { fsk, path as pathk, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.InitOptions, config: Config) => {
  return {
    ios: summary.withSummary(
      async () =>
        fsk.copyDir(
          path.resolve(__dirname, "..", "assets", "template"),
          pathk.project.path(),
          config,
          "ios"
        ),
      "template",
      "platform::ios"
    ),
    android: summary.withSummary(
      async () =>
        fsk.copyDir(
          path.resolve(__dirname, "..", "assets", "template"),
          pathk.project.path(),
          config,
          "android"
        ),
      "template",
      "platform::android"
    ),
  };
};
