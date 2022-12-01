import path from "path";
import { fs, path as pathk } from "@brandingbrand/kernel-core";

import { check, patch } from "../src/utils/dependencies";

global.process.cwd = () => path.resolve(__dirname, "fixtures");

describe("dependencies", () => {
  beforeAll(async () => {
    return fs.copyFile(
      path.resolve(__dirname, "fixtures", "mock_path.js"),
      path.resolve(__dirname, "fixtures", "temp_mock_path.js")
    );
  });

  afterAll(async () => {
    return fs.remove(path.resolve(__dirname, "fixtures", "temp_mock_path.js"));
  });

  it("check", () => {
    jest
      .spyOn(pathk.project, "packagePath")
      .mockReturnValue(
        path.resolve(__dirname, "fixtures", "mock_package.json")
      );
    const undefinedReturn = check();

    expect(undefinedReturn).toBe(undefined);
  });

  it("patch", async () => {
    jest
      .spyOn(pathk.project, "resolve")
      .mockReturnValue(
        path.resolve(__dirname, "fixtures", "temp_mock_path.js")
      );

    await patch();

    const body = await fs.readFile(
      path.resolve(__dirname, "fixtures", "temp_mock_path.js")
    );

    expect(body.toString()).toMatch("mainApplicationJava?.replace");
  });
});
