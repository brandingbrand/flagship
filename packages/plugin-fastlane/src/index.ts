import path from "path";
import {
  fsk,
  Config,
  path as pathk,
  logger,
  summary,
} from "@brandingbrand/kernel-core";
import { KernelPluginFastlane } from "./types";

const ios = summary.withSummary(
  async (config: Config & KernelPluginFastlane) => {
    if (config.kernelPluginFastlane.kernel.ios) {
      logger.logInfo("Adding iOS Fastfile...");

      const sourcePath = path.join(__dirname, "fastlane", "ios");
      const destPath = path.join(pathk.ios.rootDirPath());

      await fsk.copyDir(sourcePath, destPath, config, "ios", false);

      await fsk.update(
        pathk.project.resolve("ios", "Gemfile"),
        /(source[\s\S]+?\n)/,
        `$1

gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
`
      );
    }
  },
  "plugin-fastlane",
  "platform::ios"
);

const android = summary.withSummary(
  async (config: Config & KernelPluginFastlane) => {
    if (config.kernelPluginFastlane.kernel.android) {
      logger.logInfo("Adding Android Fastfile...");

      const sourcePath = path.join(__dirname, "fastlane", "android");
      const destPath = path.join(pathk.android.rootDirPath());

      await fsk.copyDir(sourcePath, destPath, config, "android", false);

      await fsk.update(
        pathk.project.resolve("android", "Gemfile"),
        /(source[\s\S]+?\n)/,
        `$1

gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
`
      );
    }
  },
  "plugin-fastlane",
  "platform::android"
);

export * from "./types";

export { ios, android };
