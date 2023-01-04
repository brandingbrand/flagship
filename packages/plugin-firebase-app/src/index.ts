/* eslint-disable @typescript-eslint/no-explicit-any */

import { Config, fs, fsk, path } from "@brandingbrand/kernel-core";

import type { KernelPluginFirebaseApp } from "./types";

const ios = async (config: Config & KernelPluginFirebaseApp) => {
  const { ios } = config.kernelPluginFirebaseApp?.kernel ?? {};

  if (ios) {
    await fs.copy(
      path.config.resolve("assets", ios.googleServicesPath),
      path.resolve(
        path.ios.nativeProjectPath(config),
        "GoogleService-Info.plist"
      )
    );

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
};

const android = async (config: KernelPluginFirebaseApp) => {
  const { android } = config.kernelPluginFirebaseApp?.kernel ?? {};

  if (android) {
    await fs.copy(
      path.config.resolve("assets", android.googleServicesPath),
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
};

export * from "./types";

export { ios, android };
