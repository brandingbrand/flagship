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
    if (!config.codePluginPermissions.plugin.ios) return;

    await infoPlist.setPlist(
      utils.ios.usageDescriptions(config.codePluginPermissions.plugin.ios),
      config
    );

    await fsk.update(
      path.project.resolve(
        "node_modules",
        "react-native-permissions",
        "RNPermissions.podspec"
      ),
      /"ios\/\*\.{h,m,mm}".*/,
      utils.ios.podspec(config.codePluginPermissions.plugin.ios)
    );
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
