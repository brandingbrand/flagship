/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/ios/project-pbxproj";

describe("ios project.pbxproj transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should update project.pbxproj with xcode source, header and entitlements files", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.projectPbxProj, "utf-8");

    expect(content).toContain(
      '/* app-Bridging-Header.h */ = {isa = PBXFileReference; name = "app-Bridging-Header.h"; path = "app/app-Bridging-Header.h"; sourceTree = "<group>"; fileEncoding = 4; lastKnownFileType = sourcecode.c.h; explicitFileType = undefined; includeInIndex = 0; };'
    );
    expect(content).toContain(
      '/* app.entitlements */ = {isa = PBXFileReference; name = "app.entitlements"; path = "app/app.entitlements"; sourceTree = "<group>"; fileEncoding = 4; lastKnownFileType = text.plist.entitlements; explicitFileType = undefined; includeInIndex = 0; };'
    );
    expect(content).toContain(
      '/* NativeConstants.m */ = {isa = PBXFileReference; name = "NativeConstants.m"; path = "app/NativeConstants.m"; sourceTree = "<group>"; fileEncoding = 4; lastKnownFileType = sourcecode.c.objc; explicitFileType = undefined; includeInIndex = 0; };'
    );
    expect(content).toContain(
      '/* EnvSwitcher.m */ = {isa = PBXFileReference; name = "EnvSwitcher.m"; path = "app/EnvSwitcher.m"; sourceTree = "<group>"; fileEncoding = 4; lastKnownFileType = sourcecode.c.objc; explicitFileType = undefined; includeInIndex = 0; };'
    );
    expect(content).toContain(
      '/* app.swift */ = {isa = PBXFileReference; name = "app.swift"; path = "app/app.swift"; sourceTree = "<group>"; fileEncoding = 4; lastKnownFileType = sourcecode.swift; explicitFileType = undefined; includeInIndex = 0; };'
    );
  });

  it("should update project.pbxproj with deployment target", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.deploymentTarget = "15.0";

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.projectPbxProj, "utf-8");

    expect(content).toContain("IPHONEOS_DEPLOYMENT_TARGET = 15.0");
  });

  it("should update project.pbxproj with targeted device family 1", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.targetedDevices = "1";

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.projectPbxProj, "utf-8");

    expect(content).toContain('TARGETED_DEVICE_FAMILY = "1"');
  });

  it("should update project.pbxproj with targeted device family 1,2", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.targetedDevices = "1,2";

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.projectPbxProj, "utf-8");

    expect(content).toContain('TARGETED_DEVICE_FAMILY = "1,2"');
  });

  it("should update project.pbxproj with product bundle identifier", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.projectPbxProj, "utf-8");

    expect(content).toContain(
      'PRODUCT_BUNDLE_IDENTIFIER = "com.brandingbrand"'
    );
  });

  it("should update project.pbxproj with code signing", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.signing = {
      appleCert: "",
      distCert: "",
      distP12: "",
      distCertType: "iPhone Distribution",
      exportMethod: "app-store",
      exportTeamId: "ABC12345",
      profilesDir: "",
      provisioningProfileName: "Branding Brand Provisioning Profile",
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.projectPbxProj, "utf-8");

    expect(content).toContain('CODE_SIGN_IDENTITY = "iPhone Distribution"');
    expect(content).toContain("CODE_SIGN_STYLE = Manual");
    expect(content).toContain('DEVELOPMENT_TEAM = "ABC12345"');
    expect(content).toContain(
      'PROVISIONING_PROFILE_SPECIFIER = "Branding Brand Provisioning Profile"'
    );
  });
});
