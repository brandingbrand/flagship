import path from "../src/lib/path";

describe("path", () => {
  it("should resolve paths relative to the project root", () => {
    const resolvedPath = path.project.resolve("some", "nested", "file.txt");
    expect(resolvedPath).toEqual(
      expect.stringMatching(/.*some\/nested\/file.txt$/)
    );
  });

  it("should have a config function that returns the path to flagship-code.config.ts", () => {
    const configPath = path.config;
    expect(configPath).toEqual(
      expect.stringMatching(/.*flagship-code\.config\.ts$/)
    );
  });

  it("should have an ios.infoPlist function that returns the path to ios/app/Info.plist", () => {
    const infoPlistPath = path.ios.infoPlist;
    expect(infoPlistPath).toEqual(
      expect.stringMatching(/.*ios\/app\/Info\.plist$/)
    );
  });

  it("should have an ios.envSwitcher function that returns the path to ios/app/EnvSwitcher.m", () => {
    const envSwitcherPath = path.ios.envSwitcher;
    expect(envSwitcherPath).toEqual(
      expect.stringMatching(/.*ios\/app\/EnvSwitcher\.m$/)
    );
  });

  it("should have an ios.gemfile function that returns the path to ios/app/Gemfile", () => {
    const gemfilePath = path.ios.gemfile;
    expect(gemfilePath).toEqual(expect.stringMatching(/.*ios\/Gemfile$/));
  });

  it("should have an ios.nativeConstants function that returns the path to ios/app/NativeConstants.m", () => {
    const nativeConstantsPath = path.ios.nativeConstants;
    expect(nativeConstantsPath).toEqual(
      expect.stringMatching(/.*ios\/app\/NativeConstants\.m$/)
    );
  });

  it("should have an ios.podfile function that returns the path to ios/Podfile", () => {
    const podfilePath = path.ios.podfile;
    expect(podfilePath).toEqual(expect.stringMatching(/.*ios\/Podfile$/));
  });

  it("should have an ios.projectPbxProj function that returns the path to ios/app.xcodeproj/project.pbxproj", () => {
    const projectPbxProjPath = path.ios.projectPbxProj;
    expect(projectPbxProjPath).toEqual(
      expect.stringMatching(/.*ios\/app.xcodeproj\/project\.pbxproj$/)
    );
  });

  it("should have an android.androidManifest function that returns the path to android/app/src/main/AndroidManifest.xml", () => {
    const androidManifestPath = path.android.androidManifest;
    expect(androidManifestPath).toEqual(
      expect.stringMatching(/.*android\/app\/src\/main\/AndroidManifest\.xml$/)
    );
  });

  it("should have an android.appBuildGradle function that returns the path to android/app/build.gradle", () => {
    const appBuildGradlePath = path.android.appBuildGradle;
    expect(appBuildGradlePath).toEqual(
      expect.stringMatching(/.*android\/app\/build\.gradle$/)
    );
  });

  it("should have an android.buildGradle function that returns the path to android/build.gradle", () => {
    const buildGradlePath = path.android.buildGradle;
    expect(buildGradlePath).toEqual(
      expect.stringMatching(/.*android\/build\.gradle$/)
    );
  });

  it("should have an android.colors function that returns the path to android/app/src/main/res/values/colors.xml", () => {
    const colorsPath = path.android.colors;
    expect(colorsPath).toEqual(
      expect.stringMatching(
        /.*android\/app\/src\/main\/res\/values\/colors\.xml$/
      )
    );
  });

  it("should have an android.networkSecurityConfig function that returns the path to android/app/src/main/res/xml/network_security_config.xml", () => {
    const networkSecurityConfigPath = path.android.networkSecurityConfig;
    expect(networkSecurityConfigPath).toEqual(
      expect.stringMatching(
        /.*android\/app\/src\/main\/res\/xml\/network_security_config\.xml$/
      )
    );
  });

  it("should have an android.mainApplication function that returns the path to android/app/src/main/java/com/example/app/MainApplication.java", () => {
    const config = {
      android: {
        name: "example",
        displayName: "Example",
        packageName: "com.example.app",
      },
      ios: {
        name: "example",
        displayName: "Example",
        bundleId: "com.example.app",
      },
    };
    const mainApplicationPath = path.android.mainApplication(config);
    expect(mainApplicationPath).toEqual(
      expect.stringMatching(
        /.*android\/app\/src\/main\/java\/com\/example\/app\/MainApplication\.java$/
      )
    );
  });

  it("should have an android.mainActivity function that returns the path to android/app/src/main/java/com/example/app/MainActivity.java", () => {
    const config = {
      android: {
        name: "example",
        displayName: "Example",
        packageName: "com.example.app",
      },
      ios: {
        name: "example",
        displayName: "Example",
        bundleId: "com.example.app",
      },
    };
    const mainActivityPath = path.android.mainActivity(config);
    expect(mainActivityPath).toEqual(
      expect.stringMatching(
        /.*android\/app\/src\/main\/java\/com\/example\/app\/MainActivity\.java$/
      )
    );
  });

  it("should have an android.envSwitcher function that returns the path to android/app/src/main/java/com/example/app/EnvSwitcher.java", () => {
    const config = {
      android: {
        name: "example",
        displayName: "Example",
        packageName: "com.example.app",
      },
      ios: {
        name: "example",
        displayName: "Example",
        bundleId: "com.example.app",
      },
    };
    const envSwitcherPath = path.android.envSwitcher(config);
    expect(envSwitcherPath).toEqual(
      expect.stringMatching(
        /.*android\/app\/src\/main\/java\/com\/example\/app\/EnvSwitcher\.java$/
      )
    );
  });

  it("should have an android.gemfile function that returns the path to android/Gemfile", () => {
    const gemfilePath = path.android.gemfile;
    expect(gemfilePath).toEqual(expect.stringMatching(/.*android\/Gemfile$/));
  });

  it("should have an android.gradleProperties function that returns the path to android/gradle.properties", () => {
    const gradlePropertiesPath = path.android.gradleProperties;
    expect(gradlePropertiesPath).toEqual(
      expect.stringMatching(/.*android\/gradle\.properties$/)
    );
  });

  it("should have an android.nativeConstants function that returns the path to android/app/src/main/java/com/example/app/NativeConstants.java", () => {
    const config = {
      android: {
        name: "example",
        displayName: "Example",
        packageName: "com.example.app",
      },
      ios: {
        name: "example",
        displayName: "Example",
        bundleId: "com.example.app",
      },
    };
    const nativeConstantsPath = path.android.nativeConstants(config);
    expect(nativeConstantsPath).toEqual(
      expect.stringMatching(
        /.*android\/app\/src\/main\/java\/com\/example\/app\/NativeConstants\.java$/
      )
    );
  });

  it("should have an android.strings function that returns the path to android/app/src/main/res/values/strings.xml", () => {
    const stringsPath = path.android.strings;
    expect(stringsPath).toEqual(
      expect.stringMatching(
        /.*android\/app\/src\/main\/res\/values\/strings\.xml$/
      )
    );
  });

  it("should have an android.styles function that returns the path to android/app/src/main/res/values/styles.xml", () => {
    const stylesPath = path.android.styles;
    expect(stylesPath).toEqual(
      expect.stringMatching(
        /.*android\/app\/src\/main\/res\/values\/styles\.xml$/
      )
    );
  });
});
