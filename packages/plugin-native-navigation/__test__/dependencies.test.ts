/**
 * @jest-environment-options {"fixture": "__plugin-native-navigation_dependencies_fixtures", "additionalDirectory": "./fixtures"}
 */

import path from "path";
import { fs, path as pathk } from "@brandingbrand/code-core";

import { check, patch } from "../src/utils/dependencies";

describe("dependencies", () => {
  it("check", () => {
    const undefinedReturn = check();

    expect(undefinedReturn).toBe(undefined);
  });

  it("patch", async () => {
    jest
      .spyOn(pathk.project, "resolve")
      .mockImplementation((...args: string[]) =>
        path.resolve.apply(path, [process.cwd(), "..", "..", ...args])
      );

    await patch();

    const pathFile = (
      await fs.readFile(
        pathk.project.resolve(
          "node_modules",
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
