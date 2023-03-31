import spawnAsync from "@expo/spawn-async";

import { os, path } from "../../../utils";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";
import { withSummary } from "../../../utils/summary";

export const execute = (options: InitOptions, config: Config) => ({
  ios: withSummary(
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
