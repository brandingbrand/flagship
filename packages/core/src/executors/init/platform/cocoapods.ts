import spawnAsync from "@expo/spawn-async";

import { logger, os, path } from "../../../utils";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";
import { withSummary } from "../../../utils/summary";

export const execute = (options: InitOptions, config: Config) => ({
  ios: withSummary(
    async () => {
      if (os.linux) {
        throw new Error("cannot run cocoapods on linux");
      }

      logger.logInfo("running pod install");

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
