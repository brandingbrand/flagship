import path from "path";
import { Config, path as pathk, logger } from "@brandingbrand/kernel-core";
import { copyDir } from "../../core/src/utils/fsk";
import { KernelPluginFastlane } from "./types";

const ios = async (config: Config & KernelPluginFastlane) => {
  if (config.kernelPluginFastlane.kernel.ios) {
    logger.logInfo("Adding iOS Fastfile...");
    const sourcePath = path.join(__dirname, "fastlane", "ios");
    const destPath = path.join(pathk.ios.rootDirPath());
    await copyDir(sourcePath, destPath, config, "ios", false);
  }
};

const android = async (config: Config & KernelPluginFastlane) => {
  if (config.kernelPluginFastlane.kernel.android) {
    logger.logInfo("Adding Android Fastfile...");
    const sourcePath = path.join(__dirname, "fastlane", "android");
    const destPath = path.join(pathk.android.rootDirPath());
    await copyDir(sourcePath, destPath, config, "android", false);
  }
};

export * from "./types";

export { ios, android };
