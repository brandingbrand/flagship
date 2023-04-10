/**
 * @jest-environment-options {"fixture": "__plugin-fastlane--not-release_fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";
import { android } from "../src";

describe("plugin-fastlane", () => {
  it("android--not-release", async () => {
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
      release: false,
    } as never);

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
