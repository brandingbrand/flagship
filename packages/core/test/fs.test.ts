import * as fsExtra from "fs-extra";
import * as nodePath from "path";

import { fs } from "../src";

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

  it("update", () => {
    fs.update(
      nodePath.join(tempRootDir, "ios/Podfile"),
      "target 'MOCKAPP' do",
      "target 'TESTAPP' do"
    );

    const body = fs
      .readFileSync(nodePath.join(tempRootDir, "ios/Podfile"))
      .toString();

    expect(body).toMatch("target 'TESTAPP' do");
  });

  it("keyword does exist", () => {
    expect(
      fs.doesKeywordExist(
        nodePath.join(tempRootDir, "ios/Podfile"),
        "Add new pods below this line"
      )
    ).toBeTruthy();
  });

  it("keyword doesn't exist", () => {
    expect(
      fs.doesKeywordExist(
        nodePath.join(tempRootDir, "ios/Podfile"),
        "this string has no business in our podfile"
      )
    ).toBeFalsy();
  });
});
