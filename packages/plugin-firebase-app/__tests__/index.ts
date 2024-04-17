/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "fixtures"}
 */

import fss from "fs";
import { BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import plugin, { type CodePluginFirebaseApp } from "../src";

describe("plugin-firebase-app", () => {
  it("ios", async () => {
    const config: BuildConfig & CodePluginFirebaseApp = {
      ios: {
        displayName: "App",
        bundleId: "com.app",
      },
      android: {
        displayName: "App",
        packageName: "com.app",
      },
      codePluginFirebaseApp: {
        plugin: {
          ios: {
            googleServicesPath: "coderc/assets/GoogleService-Info.plist",
          },
        },
      },
    };

    await plugin.ios?.(config, {} as any);

    const appDelegateContent = await fs.readFile(
      path.project.resolve("ios", "app", "AppDelegate.mm"),
      "utf-8"
    );
    const podfileContent = await fs.readFile(path.ios.podfile, "utf-8");

    expect(
      fss.existsSync(
        path.project.resolve("ios", "app", "GoogleService-Info.plist")
      )
    ).toBeTruthy();

    expect(await fs.readFile(path.ios.projectPbxProj, "utf-8")).toContain(
      '/* GoogleService-Info.plist */ = {isa = PBXFileReference; name = "GoogleService-Info.plist"; path = "app/GoogleService-Info.plist"; sourceTree = "<group>"; fileEncoding = 4; lastKnownFileType = text.plist.xml; explicitFileType = undefined; includeInIndex = 0; };'
    );

    ["#import <Firebase.h>", "[FIRApp configure];"].forEach((it) =>
      expect(appDelegateContent).toContain(it)
    );

    [
      "use_frameworks! :linkage => :static",
      "$RNFirebaseAsStaticFramework = true",
      "# :flipper_configuration => flipper_config,",
    ].forEach((it) => expect(podfileContent).toContain(it));
  });

  it("android", async () => {
    const config: BuildConfig & CodePluginFirebaseApp = {
      ios: {
        displayName: "App",
        bundleId: "com.app",
      },
      android: {
        displayName: "App",
        packageName: "com.app",
      },
      codePluginFirebaseApp: {
        plugin: {
          android: {
            googleServicesPath: "coderc/assets/google-services.json",
            googleServicesVersion: "4.3.1",
            firebaseBomVersion: "31.0.0",
          },
        },
      },
    };

    await plugin.android?.(config, {} as any);

    const buildGradleContent = await fs.readFile(
      path.android.buildGradle,
      "utf-8"
    );
    const appBuildGradleContent = await fs.readFile(
      path.android.appBuildGradle,
      "utf-8"
    );

    expect(
      fss.existsSync(
        path.project.resolve("android", "app", "google-services.json")
      )
    ).toBeTruthy();
    expect(buildGradleContent).toContain(
      "classpath 'com.google.gms:google-services:4.3.1'"
    );

    [
      "apply plugin: 'com.google.gms.google-services'",
      "implementation platform('com.google.firebase:firebase-bom:31.0.0'",
    ].forEach((it) => expect(appBuildGradleContent).toContain(it));
  });
});
