import path from "path";

import { fs, fsk } from "../src";

const mockProjectDir = path.join(__dirname, "fixtures", "mock_project");
const tempRootDir = path.join(__dirname, "__fs_test");

global.process.cwd = () => path.resolve(tempRootDir);

describe("fs", () => {
  beforeEach(async () => {
    return fs.copy(mockProjectDir, tempRootDir);
  });

  afterEach(async () => {
    return fs.remove(tempRootDir);
  });

  it("keyword does exist", async () => {
    expect(
      await fsk.doesKeywordExist(
        path.join(tempRootDir, "ios/Podfile"),
        "Add new pods below this line"
      )
    ).toBeTruthy();
  });

  it("update", async () => {
    await fsk.update(
      path.join(tempRootDir, "ios/Podfile"),
      "target 'MOCKAPP' do",
      "target 'TESTAPP' do"
    );

    const body = (
      await fs.readFile(path.join(tempRootDir, "ios/Podfile"))
    ).toString();

    expect(body).toMatch("target 'TESTAPP' do");
  });

  it("keyword doesn't exist", async () => {
    expect(
      await fsk.doesKeywordExist(
        path.join(tempRootDir, "ios/Podfile"),
        "this string has no business in our podfile"
      )
    ).toBeFalsy();
  });
});
