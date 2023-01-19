import type { Config } from "@brandingbrand/kernel-core";
import { fs, fsk, path } from "@brandingbrand/kernel-core";

import type { KernelPluginSplashScreen } from "../../types";

export default async (config: Config & KernelPluginSplashScreen) => {
  const {
    logoPath = "./assets/splash-screen/ios/generated/logo.png",
    size = 212,
    backgroundColor = "#333132",
  } = config.kernelPluginSplashScreen?.kernel?.ios?.generated ?? {};

  const inputFile = path.config.resolve(logoPath);
  const { generate } = require(path.project.resolve(
    "node_modules",
    "react-native-bootsplash",
    "dist",
    "commonjs",
    "generate.js"
  ));

  await generate({
    ios: { projectPath: path.project.resolve("ios", config.ios.name) },
    android: null,
    workingPath: path.project.path(),
    logoPath: inputFile,
    assetsPath: null,
    backgroundColor,
    logoWidth: size,
  });

  await fs.move(
    path.project.resolve("ios", config.ios.name, "BootSplash.storyboard"),
    path.project.resolve("ios", config.ios.name, "LaunchScreen.storyboard"),
    { overwrite: true }
  );
};
