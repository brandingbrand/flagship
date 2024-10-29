import { isCI } from "ci-info";
import spawnAsync, { SpawnOptions } from "@expo/spawn-async";

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

      const execOpts: SpawnOptions = {
        stdio: [
          options.verbose ? "inherit" : "ignore",
          options.verbose ? "inherit" : "ignore",
          options.verbose ? "inherit" : "ignore",
        ],
        cwd: path.project.resolve("ios"),
      };

      if (isCI) {
        await spawnAsync("bundle", ["exec", "pod", "install"], execOpts);
      } else {
        await spawnAsync("pod", ["install"], execOpts);
      }
    },
    "cocoapods",
    "platform::ios"
  ),
  android: async () => {
    //
  },
});
