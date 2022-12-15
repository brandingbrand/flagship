import { Config, fsk, path } from "@brandingbrand/kernel-core";

import { KernelPluginGoogleSignin } from "./types";

const ios = async (config: Config & KernelPluginGoogleSignin) => {
  if (
    await fsk.doesKeywordExist(
      path.ios.infoPlistPath(config),
      "CFBundleURLTypes"
    )
  ) {
    await fsk.update(
      path.ios.infoPlistPath(config),
      /(CFBundleURLSchemes[\s\S]+?<array>)/,
      `$1
            <string>${config.kernelPluginGoogleSignin.kernel.ios.reversedClientId}</string>`
    );
  } else {
    await fsk.update(
      path.ios.infoPlistPath(config),
      /(<plist[\s\S]+?<dict>)/,
      `$1
    <key>CFBundleURLTypes</key>
    <array>
      <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>${config.kernelPluginGoogleSignin.kernel.ios.reversedClientId}</string>
        </array>
      </dict>
    </array>`
    );
  }

  await fsk.update(
    path.ios.appDelegatePath(config),
    /(#import "AppDelegate.h")/,
    `$1
#import <RNGoogleSignin/RNGoogleSignin.h>
#import "RNGoogleSignin.h"`
  );

  await fsk.update(
    path.ios.appDelegatePath(config),
    /(if \(\[RCTLinkingManager[\s\S]+?})/,
    `$1
  if ([RNGoogleSignin application:application openURL:url options:options]) {
    return YES;
  }`
  );
};

const android = async (config: KernelPluginGoogleSignin) => {
  await fsk.update(
    path.project.resolve("android", "build.gradle"),
    /(ext {)/,
    `$1
        googlePlayServicesAuthVersion = "${
          config.kernelPluginGoogleSignin.kernel.android
            .googlePlayServicesAuthVersion || "19.2.0"
        }"`
  );

  await fsk.update(
    path.android.gradlePath(),
    /(dependencies {)/,
    `$1
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:${
      config.kernelPluginGoogleSignin.kernel.android
        .swiperefreshlayoutVersion || "1.0.0"
    }'`
  );
};

export { ios, android };
