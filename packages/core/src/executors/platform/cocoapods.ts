import { execSync } from "child_process";

import { logger, os, path } from "../../utils";

export const execute = (options: any, config: any, cliPath: string) => ({
  ios: async () => {
    if (os.linux) {
      logger.logInfo("not running pod install on linux");
      return;
    }

    logger.logInfo("running pod install");

    try {
      execSync(`cd "${path.project.resolve("ios")}" && pod install`, {
        stdio: [0, 1, 2],
      });
    } catch {
      logger.logError(
        "pod install failed, here are the few things you can try to fix:\n" +
          `\t1. Run "brew install cocoapods" if don't have cocoapods installed\n` +
          `\t2. Run "pod repo update" to update your local spec repos`
      );
      process.exit(1);
    }
  },
  android: async () => {
    logger.logInfo("not running pod install for android");
  },
});
