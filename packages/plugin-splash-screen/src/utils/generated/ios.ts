import { fs, path } from "@brandingbrand/code-core";

import type { Config } from "@brandingbrand/code-core";

import type { CodePluginSplashScreen } from "../../types";

export default async (config: Config & CodePluginSplashScreen) => {
  const {
    logoPath = "./assets/splash-screen/ios/generated/logo.png",
    size = 212,
    backgroundColor = "#333132",
  } = config.codePluginSplashScreen?.plugin?.ios?.generated ?? {};

  const inputFile = path.config.resolve(logoPath);
  const { generate } = require(path.hoist.resolve(
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
