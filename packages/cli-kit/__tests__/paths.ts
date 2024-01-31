import { paths, resolvePathFromProject } from "../src/lib/paths";

describe("Path Utility Functions", () => {
  describe("resolvePathFromProject", () => {
    it("should resolve paths relative to the project root", () => {
      const resolvedPath = resolvePathFromProject("some", "nested", "file.txt");
      expect(resolvedPath).toEqual(
        expect.stringMatching(/.*some\/nested\/file.txt$/)
      );
    });
  });

  describe("paths", () => {
    it("should have a config function that returns the path to flagship-code.config.ts", () => {
      const configPath = paths.config();
      expect(configPath).toEqual(
        expect.stringMatching(/.*flagship-code\.config\.ts$/)
      );
    });

    it("should have a project.resolve function that is the same as resolvePathFromProject", () => {
      expect(paths.project.resolve).toEqual(resolvePathFromProject);
    });

    it("should have an ios.infoPlist function that returns the path to ios/app/Info.plist", () => {
      const infoPlistPath = paths.ios.infoPlist();
      expect(infoPlistPath).toEqual(
        expect.stringMatching(/.*ios\/app\/Info\.plist$/)
      );
    });

    it("should have an ios.envSwitcher function that returns the path to ios/app/EnvSwitcher.m", () => {
      const envSwitcherPath = paths.ios.envSwitcher();
      expect(envSwitcherPath).toEqual(
        expect.stringMatching(/.*ios\/app\/EnvSwitcher\.m$/)
      );
    });

    it("should have an ios.gemfile function that returns the path to ios/app/Gemfile", () => {
      const gemfilePath = paths.ios.gemfile();
      expect(gemfilePath).toEqual(
        expect.stringMatching(/.*ios\/app\/Gemfile$/)
      );
    });

    it("should have an ios.nativeConstants function that returns the path to ios/app/NativeConstants.m", () => {
      const nativeConstantsPath = paths.ios.nativeConstants();
      expect(nativeConstantsPath).toEqual(
        expect.stringMatching(/.*ios\/app\/NativeConstants\.m$/)
      );
    });

    it("should have an ios.podfile function that returns the path to ios/Podfile", () => {
      const podfilePath = paths.ios.podfile();
      expect(podfilePath).toEqual(expect.stringMatching(/.*ios\/Podfile$/));
    });

    it("should have an ios.projectPbxProj function that returns the path to ios/app.xcodeproj/project.pbxproj", () => {
      const projectPbxProjPath = paths.ios.projectPbxProj();
      expect(projectPbxProjPath).toEqual(
        expect.stringMatching(/.*ios\/app.xcodeproj\/project\.pbxproj$/)
      );
    });

    it("should have an android.androidManifest function that returns the path to android/app/src/main/AndroidManifest.xml", () => {
      const androidManifestPath = paths.android.androidManifest();
      expect(androidManifestPath).toEqual(
        expect.stringMatching(
          /.*android\/app\/src\/main\/AndroidManifest\.xml$/
        )
      );
    });

    it("should have an android.appBuildGradle function that returns the path to android/app/build.gradle", () => {
      const appBuildGradlePath = paths.android.appBuildGradle();
      expect(appBuildGradlePath).toEqual(
        expect.stringMatching(/.*android\/app\/build\.gradle$/)
      );
    });

    it("should have an android.buildGradle function that returns the path to android/build.gradle", () => {
      const buildGradlePath = paths.android.buildGradle();
      expect(buildGradlePath).toEqual(
        expect.stringMatching(/.*android\/build\.gradle$/)
      );
    });

    it("should have an android.colors function that returns the path to android/app/src/main/res/values/colors.xml", () => {
      const colorsPath = paths.android.colors();
      expect(colorsPath).toEqual(
        expect.stringMatching(
          /.*android\/app\/src\/main\/res\/values\/colors\.xml$/
        )
      );
    });

    it("should have an android.networkSecurityConfig function that returns the path to android/app/src/main/res/xml/network_security_config.xml", () => {
      const networkSecurityConfigPath = paths.android.networkSecurityConfig();
      expect(networkSecurityConfigPath).toEqual(
        expect.stringMatching(
          /.*android\/app\/src\/main\/res\/xml\/network_security_config\.xml$/
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
      const envSwitcherPath = paths.android.envSwitcher(config);
      expect(envSwitcherPath).toEqual(
        expect.stringMatching(
          /.*android\/app\/src\/main\/java\/com\/example\/app\/EnvSwitcher\.java$/
        )
      );
    });

    it("should have an android.gemfile function that returns the path to android/Gemfile", () => {
      const gemfilePath = paths.android.gemfile();
      expect(gemfilePath).toEqual(expect.stringMatching(/.*android\/Gemfile$/));
    });

    it("should have an android.gradleProperties function that returns the path to android/gradle.properties", () => {
      const gradlePropertiesPath = paths.android.gradleProperties();
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
      const nativeConstantsPath = paths.android.nativeConstants(config);
      expect(nativeConstantsPath).toEqual(
        expect.stringMatching(
          /.*android\/app\/src\/main\/java\/com\/example\/app\/NativeConstants\.java$/
        )
      );
    });

    it("should have an android.strings function that returns the path to android/app/src/main/res/values/strings.xml", () => {
      const stringsPath = paths.android.strings();
      expect(stringsPath).toEqual(
        expect.stringMatching(
          /.*android\/app\/src\/main\/res\/values\/strings\.xml$/
        )
      );
    });

    it("should have an android.styles function that returns the path to android/app/src/main/res/values/styles.xml", () => {
      const stylesPath = paths.android.styles();
      expect(stylesPath).toEqual(
        expect.stringMatching(
          /.*android\/app\/src\/main\/res\/values\/styles\.xml$/
        )
      );
    });
  });
});
