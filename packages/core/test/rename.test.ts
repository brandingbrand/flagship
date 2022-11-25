import * as fsExtra from "fs-extra";
import * as nodePath from "path";

import { rename } from "../src";

const mockProjectDir = nodePath.join(__dirname, "fixtures", "mock_project");
const tempRootDir = nodePath.join(__dirname, "__fs_test");

global.process.cwd = () => nodePath.resolve(tempRootDir);

describe("fs", () => {
  beforeEach(() => {
    fsExtra.copySync(mockProjectDir, tempRootDir);
  });

  afterEach(() => {
    fsExtra.removeSync(tempRootDir);
  });

  it("rename package directory", () => {
    rename.pkgDirectory(
      "com.brandingbrand.reactnative.and.mockapp",
      "com.app.app",
      nodePath.join(tempRootDir, "android/app/src/main"),
      "java"
    );

    expect(
      fsExtra.pathExistsSync(
        nodePath.join(tempRootDir, "android/app/src/main/java/com/app")
      )
    ).toBeTruthy();
  });
});
