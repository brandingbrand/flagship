/**
 * @jest-environment-options {"fixture": "__plugin-firebase-app_fixtures", "additionalDirectory": "./fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-firebase-app", () => {
  it("ios", async () => {
    await ios({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      codePluginFirebaseApp: {
        plugin: {
          ios: {
            googleServicesPath: "assets/firebase/GoogleService-Info.plist",
          },
        },
      },
    });

    const appDelegate = (
      await fs.readFile(
        path.ios.appDelegatePath(global.__FLAGSHIP_CODE_CONFIG__)
      )
    ).toString();
    const pbxproj = (
      await fs.readFile(
        path.ios.pbxprojFilePath(global.__FLAGSHIP_CODE_CONFIG__)
      )
    ).toString();

    expect(appDelegate).toMatch("#import <Firebase.h>");
    expect(appDelegate).toMatch("[FIRApp configure];");
    expect(pbxproj).toMatch("/* GoogleService-Info.plist in Resources */");
  });

  it("android", async () => {
    await android({
      codePluginFirebaseApp: {
        plugin: {
          android: {
            firebaseBomVersion: "31.0.0",
            googleServicesVersion: "4.3.1",
            googleServicesPath: "assets/firebase/google-servies.json",
          },
        },
      },
    });

    const moduleGradle = (
      await fs.readFile(path.android.gradlePath())
    ).toString();
    const projectGradle = (
      await fs.readFile(path.project.resolve("android", "build.gradle"))
    ).toString();

    expect(
      await fs.pathExists(
        path.project.resolve("android", "app", "google-services.json")
      )
    ).toBeTruthy();
    expect(projectGradle).toMatch(
      "classpath 'com.google.gms:google-services:4.3.1'"
    );
    expect(moduleGradle).toMatch(
      "apply plugin: 'com.google.gms.google-services'"
    );
    expect(moduleGradle).toMatch(
      "implementation platform('com.google.firebase:firebase-bom:31.0.0')"
    );
  });
});
