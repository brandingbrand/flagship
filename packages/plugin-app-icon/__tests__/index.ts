/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "fixtures"}
 */

import { BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";
import plugin, { CodePluginAppIcon } from "../src";

jest.mock("../src/rules", () => ({
  android: [
    {
      platform: "android",
      size: { legacy: 192, adaptive: 432, notification: 96 },
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

describe("plugin-permissions", () => {
  it("ios", async () => {
    const config: BuildConfig & CodePluginAppIcon = {
      ios: {
        bundleId: "com.app",
        displayName: "App",
      },
      android: {
        packageName: "com.app",
        displayName: "App",
      },
      codePluginAppIcon: {
        plugin: {
          appIconPath: "./coderc/assets/app-icon",
          iconInsets: 20,
        },
      },
    };

    await plugin.ios?.(config, {} as any);

    expect(
      await fs.doesPathExist(
        path.project.resolve(
          "ios",
          "app",
          "Images.xcassets",
          "AppIcon.appiconset",
          "Icon-1024-ios-marketing.png"
        )
      )
    ).toBeTruthy();
  });

  it("android", async () => {
    const config: BuildConfig & CodePluginAppIcon = {
      ios: {
        bundleId: "com.app",
        displayName: "App",
      },
      android: {
        packageName: "com.app",
        displayName: "App",
      },
      codePluginAppIcon: {
        plugin: {
          appIconPath: "./coderc/assets/app-icon",
          iconInsets: 20,
        },
      },
    };

    await plugin.android?.(config, {} as any);
    expect(
      await fs.doesPathExist(
        path.project.resolve(
          "android",
          "app",
          "src",
          "main",
          "res",
          "mipmap-xxxhdpi",
          "ic_launcher_background.png"
        )
      )
    ).toBeTruthy();
    expect(
      await fs.doesPathExist(
        path.project.resolve(
          "android",
          "app",
          "src",
          "main",
          "res",
          "mipmap-xxxhdpi",
          "ic_notification.png"
        )
      )
    ).toBeTruthy();
  });
});
