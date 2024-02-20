/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "fixtures"}
 */

import { BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import plugin, { type CodePluginTargetExtension } from "../src";

describe("plugin-target-extension", () => {
  it("ios", async () => {
    const config: BuildConfig & CodePluginTargetExtension = {
      ios: {
        bundleId: "com.app",
        displayName: "App",
        signing: {
          appleCert: "signing/AppleWWDRCA.cer",
          distCert: "signing/enterprise/enterprise.cer",
          distP12: "signing/enterprise/enterprise.p12",
          distCertType: "iPhone Distribution",
          exportTeamId: "ABC12345",
          profilesDir: "signing/enterprise",
          provisioningProfileName: "App In House Provisioning Profile",
          exportMethod: "enterprise",
        },
      },
      android: {
        packageName: "com.app",
        displayName: "App",
      },
      codePluginTargetExtension: {
        plugin: [
          {
            bundleId: "com.app.notifications",
            assetsPath: "./coderc/Notifications",
            provisioningProfileName:
              "App Notification In House Provisioning Profile",
          },
        ],
      },
    };

    await plugin.ios?.(config, {} as any);

    const content = await fs.readFile(path.ios.projectPbxProj, "utf-8");

    expect(content).toContain(
      '/* Notifications.h */ = {isa = PBXFileReference; name = "Notifications.h"; path = "Notifications.h"; sourceTree = "<group>"; fileEncoding = 4; lastKnownFileType = sourcecode.c.h; explicitFileType = undefined; includeInIndex = 0; };'
    );
    expect(content).toContain(
      '/* Notifications.m */ = {isa = PBXFileReference; name = "Notifications.m"; path = "Notifications.m"; sourceTree = "<group>"; fileEncoding = 4; lastKnownFileType = sourcecode.c.objc; explicitFileType = undefined; includeInIndex = 0; };'
    );
    expect(content).toContain(
      '/* notifications.entitlements */ = {isa = PBXFileReference; name = "notifications.entitlements"; path = "notifications.entitlements"; sourceTree = "<group>"; fileEncoding = undefined; lastKnownFileType = unknown; explicitFileType = undefined; includeInIndex = 0; };'
    );
    expect(content).toContain(
      '/* Notifications.appex */ = {isa = PBXFileReference; name = "Notifications.appex"; path = "Notifications.appex"; sourceTree = BUILT_PRODUCTS_DIR; fileEncoding = undefined; lastKnownFileType = undefined; explicitFileType = "wrapper.app-extension"; includeInIndex = 0; };'
    );
  });
});
