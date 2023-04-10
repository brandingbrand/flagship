/**
 * @jest-environment-options {"fixture": "__plugin-fastlane--not-increment_fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";
import { android } from "../src";

describe("plugin-fastlane", () => {
  it("android--not-increment", async () => {
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

    const result = (
      await fs.readFile(path.project.resolve("android", "fastlane", "Fastfile"))
    ).toString();

    expect(result).not.toMatch(`lane :appcenter_bundle do
   increment_build`);
  });
});
