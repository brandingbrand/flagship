/**
 * @jest-environment-options {"fixture": "__plugin-fastlane--increment_fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";
import { android } from "../src";

describe("plugin-fastlane", () => {
  it("android--increment", async () => {
    await android({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      android: {
        name: "HelloWorld",
        displayName: "Hello World",
        packageName: "com.helloworld",
      },
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

    expect(result).toMatch(`lane :appcenter_bundle do
  increment_build`);
  });
});
