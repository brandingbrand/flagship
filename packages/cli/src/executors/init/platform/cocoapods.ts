import spawnAsync from "@expo/spawn-async";

import { os, path, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.InitOptions, config: Config) => ({
  ios: summary.withSummary(
    async () => {
      if (os.linux) {
        throw new Error("cannot run cocoapods on linux");
      }

      await spawnAsync("pod", ["install"], {
        stdio: [
          options.verbose ? "inherit" : "ignore",
          options.verbose ? "inherit" : "ignore",
          options.verbose ? "inherit" : "ignore",
        ],
        cwd: path.project.resolve("ios"),
      });
    },
    "cocoapods",
    "platform::ios"
  ),
  android: async () => {
    //
  },
});
