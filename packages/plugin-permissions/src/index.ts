/* eslint-disable @typescript-eslint/no-explicit-any */

import { Config, fsk, path } from "@brandingbrand/kernel-core";
import { KernelPluginPermissions } from "./types";

import * as utils from "./utils";

const ios = async (config: Config & KernelPluginPermissions) => {
  if (config.kernelPluginPermissions.kernel.ios) {
    await fsk.update(
      path.ios.podfilePath(),
      /(target 'HelloWorld' do)/,
      `$1\n${utils.ios.pods(config.kernelPluginPermissions.kernel.ios)}`
    );

    await fsk.update(
      path.ios.infoPlistPath(config),
      /(<plist[\s\S]+?<dict>)/,
      `$1\n${utils.ios.usageDescriptions(
        config.kernelPluginPermissions.kernel.ios
      )}`
    );
  }
};

const android = async (config: KernelPluginPermissions) => {
  if (config.kernelPluginPermissions.kernel.android) {
    await fsk.update(
      path.android.manifestPath(),
      /(<manifest[\s\S]+?>)/,
      `$1\n${utils.android.usesPermission(
        config.kernelPluginPermissions.kernel.android
      )}`
    );
  }
};

export * from "./types";

export { ios, android };
