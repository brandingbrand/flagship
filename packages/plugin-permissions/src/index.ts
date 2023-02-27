/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Config,
  fsk,
  infoPlist,
  manifest,
  path,
  summary,
} from "@brandingbrand/code-core";

import * as utils from "./utils";

import type { CodePluginPermissions } from "./types";

const ios = summary.withSummary(
  async (config: Config & CodePluginPermissions) => {
    if (config.codePluginPermissions.plugin.ios) {
      await fsk.update(
        path.ios.podfilePath(),
        /(target[\s\S]+?do)/,
        `$1\n${utils.ios.pods(config.codePluginPermissions.plugin.ios)}`
      );

      await infoPlist.setPlist(
        utils.ios.usageDescriptions(config.codePluginPermissions.plugin.ios),
        config
      );
    }
  },
  "plugin-permissions",
  "platform::ios"
);

const android = summary.withSummary(
  async (config: CodePluginPermissions) => {
    if (config.codePluginPermissions.plugin.android) {
      await manifest.addManifestElements(
        utils.android.usesPermission(
          config.codePluginPermissions.plugin.android
        )
      );
    }
  },
  "plugin-permissions",
  "platform::android"
);

export * from "./types";

export { ios, android };
