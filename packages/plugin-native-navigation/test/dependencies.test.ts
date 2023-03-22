/**
 * @jest-environment-options {"fixture": "__plugin-native-navigation_dependencies_fixtures", "additionalDirectory": "./fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";

import { check, patch } from "../src/utils/dependencies";

describe("dependencies", () => {
  it("check", () => {
    const undefinedReturn = check();

    expect(undefinedReturn).toBe(undefined);
  });

  it("patch", async () => {
    await patch();

    const pathFile = (
      await fs.readFile(
        path.hoist.resolve(
          "react-native-navigation",
          "autolink",
          "postlink",
          "path.js"
        )
      )
    ).toString();

    expect(pathFile).toMatch("mainApplicationJava?.replace");
  });
});
