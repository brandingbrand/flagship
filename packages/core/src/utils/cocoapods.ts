import { execSync as exec } from "child_process";

import * as fs from "./fs";
import * as os from "./os";
import * as path from "./path";
import * as helpers from "./logger";

/**
 * Performs a pod install.
 */
export const install = (platform: "ios" | "android"): void => {
  if (os.linux || platform === "android") {
    return;
  }

  helpers.logInfo("running pod install");

  try {
    fs.flushSync();
    exec(`cd "${path.project.resolve("ios")}" && pod install`, {
      stdio: [0, 1, 2],
    });
  } catch {
    helpers.logError(
      "pod install failed, here are the few things you can try to fix:\n" +
        `\t1. Run "brew install cocoapods" if don't have cocoapods installed\n` +
        `\t2. Run "pod repo update" to update your local spec repos`
    );

    process.exit(1);
  }
};
