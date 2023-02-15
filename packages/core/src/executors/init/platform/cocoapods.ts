import spawnAsync from "@expo/spawn-async";

import { logger, os } from "../../../utils";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = (options: InitOptions, config: Config) => ({
  ios: async () => {
    if (os.linux) {
      logger.logInfo("not running pod install on linux");
      return;
    }

    logger.logInfo("running pod install");

    try {
      const cocoapods$ = spawnAsync("pod", [
        "install",
        "--project-directory=ios",
      ]);

      cocoapods$.child.stdout?.on("data", (data) => {
        console.log(data.toString());
      });

      await cocoapods$;
    } catch (e) {
      logger.logError(e as any);
      logger.logError(
        "pod install failed, here are the few things you can try to fix:\n" +
          `\t1. Run "brew install cocoapods" if don't have cocoapods installed\n` +
          `\t2. Run "pod repo update" to update your local spec repos`
      );
      process.exit(1);
    }
  },
  android: async () => {
    //
  },
});
