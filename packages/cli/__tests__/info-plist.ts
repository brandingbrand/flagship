/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/ios/info-plist";

describe("ios Info.plist transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should update Info.plist with bundleId and displayName", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.infoPlist, "utf-8");

    expect(content).toContain(`<key>CFBundleDisplayName</key>
    <string>${config.ios.displayName}</string>`);

    expect(content).toContain(`<key>CFBundleIdentifier</key>
    <string>${config.ios.bundleId}</string>`);
  });

  it("should update Info.plist with bundle version and short version", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.versioning = {
      version: "1.5",
      build: 20,
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.infoPlist, "utf-8");

    expect(content).toContain(`<key>CFBundleShortVersionString</key>
    <string>${config.ios.versioning.version}</string>`);

    expect(content).toContain(`<key>CFBundleVersion</key>
    <string>${config.ios.versioning.build?.toString()}</string>`);
  });

  it("should update Info.plist with url scheme", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.plist = {
      urlScheme: {
        scheme: "myapp",
        host: "app",
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.infoPlist, "utf-8");

    expect(content).toContain(`<key>CFBundleURLTypes</key>
    <array>
      <dict>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>${config.ios.plist.urlScheme?.scheme}://${config.ios.plist.urlScheme?.host}</string>
        </array>
      </dict>
    </array>`);
  });

  it("should update Info.plist with generic value", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.plist = {
      style: "light",
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.infoPlist, "utf-8");

    expect(content).toContain(`<key>UIUserInterfaceStyle</key>
    <string>Light</string>`);
  });

  it("should update Info.plist with generic value", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.plist = {
      style: "dark",
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.infoPlist, "utf-8");

    expect(content).toContain(`<key>UIUserInterfaceStyle</key>
    <string>Dark</string>`);
  });

  it("should update Info.plist with generic value", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.plist = {
      style: "system",
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.infoPlist, "utf-8");

    expect(content).toContain(`<key>UIUserInterfaceStyle</key>
    <string>Automatic</string>`);
  });

  it("should remove NSExceptionDomains children from Info.plist in release mode", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    await transformer.transform(config, { release: true } as any);
    const content = await fs.readFile(path.ios.infoPlist, "utf-8");

    expect(content).not.toContain(`<key>localhost</key>
    <dict>
      <key>NSExceptionAllowsInsecureHTTPLoads</key>
      <true/>
    </dict>`);
  });
});
