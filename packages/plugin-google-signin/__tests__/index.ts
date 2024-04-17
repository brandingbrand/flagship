/**
 * @jest-environment-options {"requireTemplate": true}
 */

import { BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";
import plugin, { type CodePluginGoogleSignin } from "../src";

describe("plugin-google-signin", () => {
  it("ios", async () => {
    const config: BuildConfig & CodePluginGoogleSignin = {
      ios: {
        displayName: "App",
        bundleId: "com.app",
      },
      android: {
        displayName: "App",
        packageName: "com.app",
      },
      codePluginGoogleSignin: {
        plugin: {
          ios: {
            reversedClientId: "blah",
          },
          android: {},
        },
      },
    };

    await plugin.ios?.(config, {} as any);

    expect(await fs.readFile(path.ios.infoPlist, "utf-8")).toContain(`<array>
      <dict>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>blah</string>
        </array>
      </dict>
    </array>`);

    expect(
      await fs.readFile(
        path.project.resolve("ios", "app", "AppDelegate.mm"),
        "utf-8"
      )
    )
      .toContain(`if ([RNGoogleSignin application:application openURL:url options:options]) {
    return YES;
  }`);

    expect(
      await fs.readFile(
        path.project.resolve("ios", "app", "AppDelegate.mm"),
        "utf-8"
      )
    ).toContain("#import <RNGoogleSignin/RNGoogleSignin.h>");
  });

  it("android", async () => {
    const config: BuildConfig & CodePluginGoogleSignin = {
      ios: {
        displayName: "App",
        bundleId: "com.app",
      },
      android: {
        displayName: "App",
        packageName: "com.app",
      },
      codePluginGoogleSignin: {
        plugin: {
          ios: {
            reversedClientId: "blah",
          },
          android: {},
        },
      },
    };

    await plugin.android?.(config, {} as any);

    expect(await fs.readFile(path.android.buildGradle, "utf-8")).toContain(
      'googlePlayServicesAuthVersion = "19.2.0"'
    );

    expect(await fs.readFile(path.android.appBuildGradle, "utf-8")).toContain(
      "implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.0.0"
    );
  });

  it("android versions", async () => {
    const config: BuildConfig & CodePluginGoogleSignin = {
      ios: {
        displayName: "App",
        bundleId: "com.app",
      },
      android: {
        displayName: "App",
        packageName: "com.app",
      },
      codePluginGoogleSignin: {
        plugin: {
          ios: {
            reversedClientId: "blah",
          },
          android: {
            googlePlayServicesAuthVersion: "20.0.0",
            swiperefreshlayoutVersion: "2.0.0",
          },
        },
      },
    };

    await plugin.android?.(config, {} as any);

    expect(await fs.readFile(path.android.buildGradle, "utf-8")).toContain(
      'googlePlayServicesAuthVersion = "20.0.0"'
    );

    expect(await fs.readFile(path.android.appBuildGradle, "utf-8")).toContain(
      "implementation 'androidx.swiperefreshlayout:swiperefreshlayout:2.0.0"
    );
  });
});
