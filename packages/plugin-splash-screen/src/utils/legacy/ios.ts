import { Config, Xcode } from "@brandingbrand/kernel-core";
import { fs, path as kpath } from "@brandingbrand/kernel-core";

import type { KernelPluginSplashScreen } from "../../types";

export default async (config: Config & KernelPluginSplashScreen) => {
  const {
    path = "assets/splash-screen/ios/legacy",
    xcassets = "LaunchImages.xcassets",
  } = config.kernelPluginSplashScreen.kernel?.ios?.legacy ?? {};

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
