import * as nodePath from "path";

import { fs, nativeConstants } from "../src";

const mockProjectDir = nodePath.join(__dirname, "fixtures", "mock_project");
const tempRootDir = nodePath.join(__dirname, "__native_constants_test");
const appName = "MOCKAPP";

global.process.cwd = () => nodePath.resolve(tempRootDir);

describe("native-constants", () => {
  beforeEach(() => {
    fs.removeSync(tempRootDir);
    fs.copySync(mockProjectDir, tempRootDir);
  });

  afterEach(() => {
    fs.removeSync(tempRootDir);
  });

  it(`add native constants to android`, () => {
    nativeConstants.addAndroid(
      { name: appName } as never,
      "TEST_KEY",
      "TEST_VALUE"
    );

    const NativeConstantsFile = fs
      .readFileSync(
        nodePath.join(
          tempRootDir,
          `android/app/src/main/java/com/brandingbrand/reactnative/and/mockapp/NativeConstants.java`
        )
      )
      .toString();

    expect(NativeConstantsFile).toMatch(
      `constants.put("TEST_KEY", "TEST_VALUE");`
    );
  });

  it(`add native constants to ios`, () => {
    nativeConstants.addIOS(
      { name: appName } as never,
      "TEST_KEY",
      "TEST_VALUE"
    );

    const NativeConstantsFile = fs
      .readFileSync(
        nodePath.join(tempRootDir, `ios/${appName}/NativeConstants.m`)
      )
      .toString();

    expect(NativeConstantsFile).toMatch(`, @"TEST_KEY": @"TEST_VALUE"`);
  });
});
