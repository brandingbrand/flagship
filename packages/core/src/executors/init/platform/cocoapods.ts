import spawnAsync from "@expo/spawn-async";

import { logger, os } from "../../../utils";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";
import { withSummary } from "../../../utils/summary";

export const execute = (options: InitOptions, config: Config) => ({
  ios: withSummary(
    async () => {
      if (os.linux) {
        logger.logInfo("not running pod install on linux");
        return;
      }

      logger.logInfo("running pod install");

      const cocoapods$ = spawnAsync("pod", [
        "install",
        "--project-directory=ios",
      ]);

      cocoapods$.child.stdout?.on("data", (data) => {
        console.log(data.toString());
      });

      await cocoapods$;
    },
    "cocoapods",
    "platform::ios"
  ),
  android: async () => {
    //
  },
});
