import fs from "fs-extra";
import path from "path";

import { rename } from "../src";

const mockProjectDir = path.join(__dirname, "fixtures", "mock_project");
const tempRootDir = path.join(__dirname, "__rename_test");

global.process.cwd = () => path.resolve(tempRootDir);

describe("rename", () => {
  beforeEach(async () => {
    return fs.copy(mockProjectDir, tempRootDir);
  });

  afterEach(async () => {
    return fs.remove(tempRootDir);
  });

  it("rename package directory", async () => {
    await rename.pkgDirectory(
      "com.brandingbrand.reactnative.and.mockapp",
      "com.app.app",
      path.join(tempRootDir, "android/app/src/main"),
      "java"
    );

    expect(
      await fs.pathExists(
        path.join(tempRootDir, "android/app/src/main/java/com/app/app")
      )
    ).toBeTruthy();
  });
});
