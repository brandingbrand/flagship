import { fs, path as kpath, Xcode } from "@brandingbrand/code-core";

import type { Config } from "@brandingbrand/code-core";

import type { CodePluginSplashScreen } from "../../types";

export default async (config: Config & CodePluginSplashScreen) => {
  const {
    path = "assets/splash-screen/ios/legacy",
    xcassets = "LaunchImages.xcassets",
  } = config.codePluginSplashScreen.plugin?.ios?.legacy ?? {};

  await fs.copy(
    kpath.config.resolve(path),
    kpath.ios.nativeProjectPath(config),
    {
      overwrite: true,
    }
  );

  await new Xcode(config)
    .addResourceFileBuilder(
      `${config.ios.name}/${xcassets}`,
      config.ios.name,
      config.ios.name
    )
    .build();
};
