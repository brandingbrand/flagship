/**
 * @jest-environment-options {"fixture": "__plugin-google-signin_fixtures"}
 */

import { path, fs } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-google-signin", () => {
  it("ios", async () => {
    await ios({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      codePluginGoogleSignin: {
        plugin: {
          ios: {
            reversedClientId: "code-app",
          },
          android: {},
        },
      },
    });

    const appDelegate = (
      await fs.readFile(
        path.ios.appDelegatePath(global.__FLAGSHIP_CODE_CONFIG__)
      )
    ).toString();
    const infoPlist = (
      await fs.readFile(path.ios.infoPlistPath(global.__FLAGSHIP_CODE_CONFIG__))
    ).toString();

    expect(appDelegate).toMatch("#import <RNGoogleSignin/RNGoogleSignin.h>");
    expect(appDelegate).toMatch(
      "[RNGoogleSignin application:application openURL:url options:options]"
    );
    expect(infoPlist).toMatch("CFBundleURLSchemes");
    expect(infoPlist).toMatch("<string>code-app</string>");
  });

  it("android", async () => {
    await android({
      codePluginGoogleSignin: {
        plugin: {
          ios: {
            reversedClientId: "code-app",
          },
          android: {},
        },
      },
    });

    const moduleGradle = (
      await fs.readFile(path.android.gradlePath())
    ).toString();
    const projectGradle = (
      await fs.readFile(path.project.resolve("android", "build.gradle"))
    ).toString();

    expect(moduleGradle).toMatch(
      "implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.0.0'"
    );
    expect(projectGradle).toMatch('googlePlayServicesAuthVersion = "19.2.0"');
  });
});
