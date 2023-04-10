/**
 * @jest-environment-options {"fixture": "__plugin-fastlane_fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";
import { ios, android } from "../src";

describe("plugin-fastlane", () => {
  it("ios", async () => {
    await ios({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      ios: {
        ...global.__FLAGSHIP_CODE_CONFIG__.ios,
        signing: {
          distCertType: "iPhone Distribution",
          exportTeamId: "762H5V79XV",
          exportMethod: "enterprise",
          provisioningProfileName: "Test Provisioning Profile",
          profilesDir: "./xx",
          appleCert: "",
          distCert: "",
          distP12: "",
        },
      },
      codePluginFastlane: {
        plugin: {
          ios: {
            appCenter: {
              organization: "Branding-Brand",
              appName: "FlagshipCode-iOS-Internal",
              destinationType: "group",
              destinations: ["IAT"],
            },
            buildScheme: "code",
          },
        },
      },
    });

    const iosCases = [
      `owner_name: "Branding-Brand"`,
      `app_name: "FlagshipCode-iOS-Internal"`,
      `version: "1.0.0"`,
      `scheme: "code"`,
      `export_method: "enterprise"`,
      `export_team_id: "762H5V79XV"`,
      `destination_type: "group"`,
      `destinations: "${["IAT"]}"`,
    ];
    const result = (
      await fs.readFile(path.project.resolve("ios", "fastlane", "Fastfile"))
    ).toString();

    iosCases.forEach(function (testCase) {
      expect(result).toMatch(testCase);
    });
  });

  it("android", async () => {
    await android({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      codePluginFastlane: {
        plugin: {
          android: {
            appCenter: {
              organization: "Branding-Brand",
              appName: "FlagshipCode-Android-Internal",
              destinationType: "group",
              destinations: ["IAT"],
            },
          },
        },
      },
    });

    const androidCases = [
      `owner_name: "Branding-Brand"`,
      `app_name: "FlagshipCode-Android-Internal"`,
      `version: "1.0.0"`,
      `destination_type: "group"`,
      `destinations: "${["IAT"]}"`,
    ];
    const result = (
      await fs.readFile(path.project.resolve("android", "fastlane", "Fastfile"))
    ).toString();

    androidCases.forEach(function (testCase) {
      expect(result).toMatch(testCase);
    });
  });
});
