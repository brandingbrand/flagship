import * as path from '../src/lib/path';

import * as fs from 'fs-extra';
import * as nodePath from 'path';

const mockProjectDir = nodePath.join(__dirname, 'mock_project');
const tempRootDir = nodePath.join(__dirname, '__path_test');
const appName = 'MOCKAPP';

global.process.cwd = () => nodePath.resolve(tempRootDir);

beforeEach(() => {
  fs.removeSync(tempRootDir);
  fs.copySync(mockProjectDir, tempRootDir);
});

afterEach(() => {
  fs.removeSync(tempRootDir);
});

test(`get ios fastfile path`, () => {
  expect(path.ios.fastfilePath()).toEqual(nodePath.join(tempRootDir, `ios/fastlane/Fastfile`));
});

test(`get info plist path`, () => {
  expect(path.ios.infoPlistPath({ name: appName } as any)).toEqual(
    nodePath.join(tempRootDir, `ios/${appName}/Info.plist`)
  );
});

test(`get podfile path`, () => {
  expect(path.ios.podfilePath()).toEqual(nodePath.join(tempRootDir, `ios/Podfile`));
});

test(`get pbxproj file path`, () => {
  expect(path.ios.pbxprojFilePath({ name: appName } as any)).toEqual(
    nodePath.join(tempRootDir, `ios/${appName}.xcodeproj/project.pbxproj`)
  );
});

test(`get ios native project path`, () => {
  expect(path.ios.nativeProjectPath({ name: appName } as any)).toEqual(
    nodePath.join(tempRootDir, `ios/${appName}`)
  );
});

test(`get main activity path`, () => {
  expect(
    path.android.mainActivityPath({
      name: appName,
    } as any)
  ).toEqual(
    nodePath.join(
      tempRootDir,
      `android/app/src/main/java/com/brandingbrand/reactnative/and/mockapp/MainActivity.java`
    )
  );
});

test(`get main application path`, () => {
  expect(
    path.android.mainApplicationPath({
      name: appName,
    } as any)
  ).toEqual(
    nodePath.join(
      tempRootDir,
      `android/app/src/main/java/com/brandingbrand/reactnative/and/mockapp/MainApplication.java`
    )
  );
});

test(`get android native project path`, () => {
  expect(
    path.android.nativeProjectPath({
      name: appName,
    } as any)
  ).toEqual(
    nodePath.join(
      tempRootDir,
      `android/app/src/main/java/com/brandingbrand/reactnative/and/mockapp`
    )
  );
});

test(`get app build.gradle path`, () => {
  expect(path.android.gradlePath()).toEqual(nodePath.join(tempRootDir, `android/app/build.gradle`));
});

test(`get project gradle.properties path`, () => {
  expect(path.android.gradlePropertiesPath()).toEqual(
    nodePath.join(tempRootDir, `android/gradle.properties`)
  );
});

test(`get main path`, () => {
  expect(path.android.mainPath()).toEqual(nodePath.join(tempRootDir, `android/app/src/main`));
});

test(`get assets path`, () => {
  expect(path.android.assetsPath()).toEqual(
    nodePath.join(tempRootDir, `android/app/src/main/assets`)
  );
});

test(`get resource path`, () => {
  expect(path.android.resourcesPath()).toEqual(
    nodePath.join(tempRootDir, `android/app/src/main/res`)
  );
});

test(`get string xml path`, () => {
  expect(path.android.stringsPath()).toEqual(
    nodePath.join(tempRootDir, `android/app/src/main/res/values/strings.xml`)
  );
});

test(`get styles xml path`, () => {
  expect(path.android.stylesPath()).toEqual(
    nodePath.join(tempRootDir, `android/app/src/main/res/values/styles.xml`)
  );
});

test(`get android fast file path`, () => {
  expect(path.android.fastfilePath()).toEqual(
    nodePath.join(tempRootDir, `android/fastlane/Fastfile`)
  );
});

// Force to be treated as a module
export {};
