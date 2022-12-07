/* eslint-disable @typescript-eslint/no-explicit-any */

import { fsk, path } from "@brandingbrand/kernel-core";
import { PluginPermissionsConfig } from "./types";

import * as utils from "./utils";

const ios = async (config: PluginPermissionsConfig) => {
  if (config.permissions.ios) {
    await fsk.update(
      path.ios.podfilePath(),
      /(target 'HelloWorld' do)/,
      `$1\n${utils.ios.pods(config.permissions.ios)}`
    );

    await fsk.update(
      path.ios.infoPlistPath({ name: "HelloWorld" } as any),
      /(<plist[\s\S]+?<dict>)/,
      `$1\n${utils.ios.usageDescriptions(config.permissions.ios)}`
    );
  }
};

const android = async (config: PluginPermissionsConfig) => {
  if (config.permissions.android) {
    await fsk.update(
      path.android.manifestPath(),
      /(<manifest[\s\S]+?>)/,
      `$1\n${utils.android.usesPermission(config.permissions.android)}`
    );
  }
};

export * from "./types";

export { ios, android };
