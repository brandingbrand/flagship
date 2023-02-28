import {
  Config,
  fs,
  fsk,
  path,
  summary,
  Xcode,
} from "@brandingbrand/code-core";

import type { CodePluginFirebaseApp } from "./types";

const ios = summary.withSummary(
  async (config: Config & CodePluginFirebaseApp) => {
    const { ios } = config?.codePluginFirebaseApp?.plugin ?? {};

    if (ios) {
      await fs.copy(
        path.config.resolve(ios.googleServicesPath),
        path.resolve(
          path.ios.nativeProjectPath(config),
          "GoogleService-Info.plist"
        )
      );

      const xcode = new Xcode(config);

      const group = xcode.getGroup("Resources");

      if (!group) {
        xcode.addPbxGroupBuilder([], "Resources", "");
      }

      await xcode
        .addResourceFileBuilder(
          `${config.ios.name}/GoogleService-Info.plist`,
          config.ios.name,
          config.ios.name
        )
        .build();

      await fsk.update(
        path.ios.appDelegatePath(config),
        /(#import "AppDelegate.h")/,
        `$1
#import <Firebase.h>`
      );

      await fsk.update(
        path.ios.appDelegatePath(config),
        /(didFinishLaunchingWithOptions[\s\S]+?{)/,
        `$1
  [FIRApp configure];`
      );
    }
  },
  "plugin-firebase",
  "platform::ios"
);

const android = summary.withSummary(
  async (config: CodePluginFirebaseApp) => {
    const { android } = config.codePluginFirebaseApp?.plugin ?? {};

    if (android) {
      await fs.copy(
        path.config.resolve(android.googleServicesPath),
        path.project.resolve("android", "app", "google-services.json")
      );

      await fsk.update(
        path.project.resolve("android", "build.gradle"),
        /(dependencies {)/,
        `$1
        classpath 'com.google.gms:google-services:${android.googleServicesVersion}'`
      );

      await fs.appendFile(
        path.android.gradlePath(),
        "apply plugin: 'com.google.gms.google-services'"
      );

      await fsk.update(
        path.android.gradlePath(),
        /(dependencies {)/,
        `$1
    implementation platform('com.google.firebase:firebase-bom:${android.firebaseBomVersion}')`
      );
    }
  },
  "plugin-firebase",
  "platform::android"
);

export * from "./types";

export { ios, android };
