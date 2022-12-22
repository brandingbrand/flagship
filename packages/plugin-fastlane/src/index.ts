import fs from "fs-extra";
import ejs from "ejs";

import { Config, path, logger } from "@brandingbrand/kernel-core";
import { KernelPluginFastlane } from "./types";

interface PathConfig {
  platform: "ios" | "android";
  path: typeof path.ios | typeof path.android;
}

const initFastFile = async (
  pathConfig: PathConfig,
  config: Config & KernelPluginFastlane
) => {
  const templateDir = path.resolve(
    path.project.pluginPath("plugin-fastlane"),
    "template",
    pathConfig.platform,
    "fastlane"
  );

  const targetDir = path.resolve(pathConfig.path.rootDirPath(), "fastlane");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  await fs.copyFile(
    path.resolve(templateDir, "PluginFile"),
    path.resolve(targetDir, "PluginFile")
  );

  const templateContent = await fs.readFile(
    path.resolve(templateDir, "Fastfile.template"),
    "utf8"
  );

  await fs.writeFile(
    pathConfig.path.fastfilePath(),
    ejs.render(templateContent, config)
  );
};

const ios = async (config: Config & KernelPluginFastlane) => {
  if (config.kernelPluginFastlane.kernel.ios) {
    logger.logInfo("Adding iOS Fastfile...");
    await initFastFile(
      {
        platform: "ios",
        path: path.ios,
      },
      config
    );
  }
};

const android = async (config: Config & KernelPluginFastlane) => {
  if (config.kernelPluginFastlane.kernel.android) {
    logger.logInfo("Adding Android Fastfile...");
    await initFastFile(
      {
        platform: "android",
        path: path.android,
      },
      config
    );
  }
};

export * from "./types";

export { ios, android };
