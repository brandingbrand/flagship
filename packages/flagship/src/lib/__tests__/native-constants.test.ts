const nativeConstants = require(`../native-constants`);
const fs = require('../fs');
const nodePath = require(`path`);

const mockProjectDir = nodePath.join(__dirname, '..', '..', '..', '__tests__', `mock_project`);
const tempRootDir = nodePath.join(__dirname, `__native_constants_test`);
const appName = `MOCKAPP`;

global.process.cwd = () => nodePath.resolve(tempRootDir);

beforeEach(() => {
  fs.removeSync(tempRootDir);
  fs.copySync(mockProjectDir, tempRootDir);
});

afterEach(() => {
  fs.removeSync(tempRootDir);
});

test(`add native constants to android`, () => {
  nativeConstants.addAndroid({ name: appName }, 'TEST_KEY', 'TEST_VALUE');

  const NativeConstantsFile = fs
    .readFileSync(
      nodePath.join(
        tempRootDir,
        `android/app/src/main/java/com/brandingbrand/reactnative/and/mockapp/NativeConstants.java`
      )
    )
    .toString();

  expect(NativeConstantsFile).toMatch(`constants.put("TEST_KEY", "TEST_VALUE");`);
});

test(`add native constants to ios`, () => {
  nativeConstants.addIOS({ name: appName }, 'TEST_KEY', 'TEST_VALUE');

  const NativeConstantsFile = fs
    .readFileSync(nodePath.join(tempRootDir, `ios/${appName}/NativeConstants.m`))
    .toString();

  expect(NativeConstantsFile).toMatch(`, @"TEST_KEY": @"TEST_VALUE"`);
});

// Force to be treated as a module
export {};
