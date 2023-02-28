/**
 * @jest-environment-options {"fixture": "__plugin-app-icon_fixtures", "additionalDirectory": "./fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";

import { ios, android } from "../src";

jest.mock("../src/utils/rules", () => ({
  android: [
    {
      platform: "android",
      size: { legacy: 192, adaptive: 432 },
      dpi: "xxxhdpi",
    },
  ],
  ios: [
    {
      platform: "ios",
      size: { universal: 1024 },
      scale: 1,
      idiom: "ios-marketing",
    },
  ],
}));

describe("plugin-app-icon", () => {
  it("ios", async () => {
    await ios({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      codePluginAppIcon: {},
    });

    expect(
      await fs.pathExists(
        path.project.resolve(
          "ios",
          global.__FLAGSHIP_CODE_CONFIG__.ios.name,
          "Images.xcassets",
          "AppIcon.appiconset",
          "Icon-1024-ios-marketing.png"
        )
      )
    ).toBeTruthy();
  });

  it("android", async () => {
    await android({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      codePluginAppIcon: {},
    });

    expect(
      await fs.pathExists(
        path.project.resolve(
          path.android.resourcesPath(),
          "mipmap-xxxhdpi",
          "ic_launcher_background.png"
        )
      )
    ).toBeTruthy();
  });
});
