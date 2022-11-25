import fs from "fs-extra";
import nodePath from "path";

import { path } from "../src";

const appName = `MOCKAPP`;
const tempRootDir = nodePath.join(__dirname, `__path_test`);
const mockProjectDir = nodePath.join(__dirname, "fixtures", "mock_project");

global.process.cwd = () => nodePath.resolve(tempRootDir);

describe("path", () => {
  beforeAll(() => {
    fs.copySync(mockProjectDir, tempRootDir);
  });

  afterAll(() => {
    fs.removeSync(tempRootDir);
  });

  it(`get ios fastfile path`, () => {
    expect(path.ios.fastfilePath()).toEqual(
      nodePath.join(tempRootDir, `ios/fastlane/Fastfile`)
    );
  });

  it(`get info plist path`, () => {
    expect(path.ios.infoPlistPath({ name: appName } as never)).toEqual(
      nodePath.join(tempRootDir, `ios/${appName}/Info.plist`)
    );
  });

  it(`get podfile path`, () => {
    expect(path.ios.podfilePath()).toEqual(
      nodePath.join(tempRootDir, `ios/Podfile`)
    );
  });

  it(`get pbxproj file path`, () => {
    expect(path.ios.pbxprojFilePath({ name: appName } as never)).toEqual(
      nodePath.join(tempRootDir, `ios/${appName}.xcodeproj/project.pbxproj`)
    );
  });

  it(`get ios native project path`, () => {
    expect(path.ios.nativeProjectPath({ name: appName } as never)).toEqual(
      nodePath.join(tempRootDir, `ios/${appName}`)
    );
  });

  it(`get main activity path`, () => {
    expect(
      path.android.mainActivityPath({
        name: appName,
      } as never)
    ).toEqual(
      nodePath.join(
        tempRootDir,
        `android/app/src/main/java/com/brandingbrand/reactnative/and/mockapp/MainActivity.java`
      )
    );
  });

  it(`get main application path`, () => {
    expect(
      path.android.mainApplicationPath({
        name: appName,
      } as never)
    ).toEqual(
      nodePath.join(
        tempRootDir,
        `android/app/src/main/java/com/brandingbrand/reactnative/and/mockapp/MainApplication.java`
      )
    );
  });

  it(`get android native project path`, () => {
    expect(
      path.android.nativeProjectPath({
        name: appName,
      } as never)
    ).toEqual(
      nodePath.join(
        tempRootDir,
        `android/app/src/main/java/com/brandingbrand/reactnative/and/mockapp`
      )
    );
  });

  it(`get app build.gradle path`, () => {
    expect(path.android.gradlePath()).toEqual(
      nodePath.join(tempRootDir, `android/app/build.gradle`)
    );
  });

  it(`get project gradle.properties path`, () => {
    expect(path.android.gradlePropertiesPath()).toEqual(
      nodePath.join(tempRootDir, `android/gradle.properties`)
    );
  });

  it(`get main path`, () => {
    expect(path.android.mainPath()).toEqual(
      nodePath.join(tempRootDir, `android/app/src/main`)
    );
  });

  it(`get assets path`, () => {
    expect(path.android.assetsPath()).toEqual(
      nodePath.join(tempRootDir, `android/app/src/main/assets`)
    );
  });

  it(`get resource path`, () => {
    expect(path.android.resourcesPath()).toEqual(
      nodePath.join(tempRootDir, `android/app/src/main/res`)
    );
  });

  it(`get string xml path`, () => {
    expect(path.android.stringsPath()).toEqual(
      nodePath.join(tempRootDir, `android/app/src/main/res/values/strings.xml`)
    );
  });

  it(`get styles xml path`, () => {
    expect(path.android.stylesPath()).toEqual(
      nodePath.join(tempRootDir, `android/app/src/main/res/values/styles.xml`)
    );
  });

  it(`get android fast file path`, () => {
    expect(path.android.fastfilePath()).toEqual(
      nodePath.join(tempRootDir, `android/fastlane/Fastfile`)
    );
  });
});
