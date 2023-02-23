import { path, fs } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-google-signin", () => {
  beforeAll(async () => {
    return fs.copy(
      path.resolve(__dirname, "fixtures"),
      path.resolve(__dirname, "__google_fixtures")
    );
  });

  afterAll(async () => {
    return fs.remove(path.resolve(__dirname, "__google_fixtures"));
  });

  it("ios", async () => {
    jest
      .spyOn(path.ios, "infoPlistPath")
      .mockReturnValue(
        path.resolve(__dirname, "__google_fixtures", "Info.plist")
      );

    jest
      .spyOn(path.ios, "appDelegatePath")
      .mockReturnValue(
        path.resolve(__dirname, "__google_fixtures", "AppDelegate.mm")
      );

    await ios({
      ios: { name: "HelloWorld" },
      codePluginGoogleSignin: {
        plugin: {
          ios: {
            reversedClientId: "code-app",
          },
          android: {},
        },
      },
    } as never);

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__google_fixtures", "AppDelegate.mm")
        )
      ).toString()
    ).toMatch(
      '#import <RNGoogleSignin/RNGoogleSignin.h>\n#import "RNGoogleSignin.h"'
    );

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__google_fixtures", "AppDelegate.mm")
        )
      ).toString()
    ).toMatch(
      "[RNGoogleSignin application:application openURL:url options:options]"
    );

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__google_fixtures", "Info.plist")
        )
      ).toString()
    ).toMatch("CFBundleURLSchemes");

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__google_fixtures", "Info.plist")
        )
      ).toString()
    ).toMatch("<string>code-app</string>");
  });

  it("android", async () => {
    jest
      .spyOn(path.android, "gradlePath")
      .mockReturnValue(
        path.resolve(__dirname, "__google_fixtures", "mbuild.gradle")
      );

    jest
      .spyOn(path.project, "resolve")
      .mockReturnValue(
        path.resolve(__dirname, "__google_fixtures", "pbuild.gradle")
      );

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

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__google_fixtures", "mbuild.gradle")
        )
      ).toString()
    ).toMatch(
      "implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.0.0'"
    );

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__google_fixtures", "pbuild.gradle")
        )
      ).toString()
    ).toMatch('googlePlayServicesAuthVersion = "19.2.0"');
  });
});
