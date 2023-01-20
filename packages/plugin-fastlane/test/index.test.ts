import { fs, fsk, path } from "@brandingbrand/kernel-core";
import { ios, android } from "../src";

describe("plugin-fastlane", () => {
  beforeAll(async () => {
    fs.mkdirSync(path.resolve(__dirname, "__fastlane_fixtures"));
    fs.mkdirSync(path.resolve(__dirname, "__fastlane_fixtures", "ios"));
    fs.mkdirSync(path.resolve(__dirname, "__fastlane_fixtures", "android"));
    return;
  });

  afterAll(async () => {
    return fs.remove(path.resolve(__dirname, "__fastlane_fixtures"));
  });

  it("ios", async () => {
    jest
      .spyOn(fsk, "update")
      .mockImplementation(
        (path: string, oldText: string | RegExp, newText: string) =>
          Promise.resolve()
      );
    jest
      .spyOn(path.ios, "rootDirPath")
      .mockReturnValue(path.resolve(__dirname, "__fastlane_fixtures", "ios"));
    const iosConfig = {
      ios: {
        bundleId: "com.kernel",
        versioning: {
          version: "0.0.1",
          build: 1,
        },
        signing: {
          distCertType: "iPhone Distribution",
          exportTeamId: "762H5V79XV",
          exportMethod: "test",
          provisioningProfileName: "Test Provisioning Profile",
          profilesDir: "./xx",
        },
      },
      kernelPluginFastlane: {
        kernel: {
          ios: {
            appCenter: {
              organization: "Branding-Brand",
              appName: "TestApp-iOS-Internal",
              destinationType: "test",
              destinations: ["IAT", "UAT"],
            },
            buildScheme: "kernel",
          },
        },
      },
    };
    await ios(iosConfig as never);
    const iosCases = [
      `owner_name: "${iosConfig.kernelPluginFastlane.kernel.ios.appCenter.organization}"`,
      `app_name: "${iosConfig.kernelPluginFastlane.kernel.ios.appCenter.appName}"`,
      `version: "${iosConfig.ios.versioning.version}"`,
      `scheme: "${iosConfig.kernelPluginFastlane.kernel.ios.buildScheme}"`,
      `export_method: "${iosConfig.ios.signing.exportMethod}"`,
      `export_team_id: "${iosConfig.ios.signing.exportTeamId}"`,
      `destination_type: "${iosConfig.kernelPluginFastlane.kernel.ios.appCenter.destinationType}"`,
      `destinations: "${iosConfig.kernelPluginFastlane.kernel.ios.appCenter.destinations}"`,
    ];
    const result = await fs.readFile(
      path.resolve(
        __dirname,
        "__fastlane_fixtures",
        "ios",
        "fastlane",
        "Fastfile"
      ),
      "utf8"
    );
    iosCases.forEach(function (testCase) {
      expect(result).toContain(testCase);
    });
  });

  it("android", async () => {
    jest
      .spyOn(fsk, "update")
      .mockImplementation(
        (path: string, oldText: string | RegExp, newText: string) =>
          Promise.resolve()
      );
    jest
      .spyOn(path.android, "rootDirPath")
      .mockReturnValue(
        path.resolve(__dirname, "__fastlane_fixtures", "android")
      );
    const androidConfig = {
      android: {
        bundleId: "com.kernel",
        versioning: {
          version: "0.0.1",
          build: 1,
        },
        signing: {
          distCertType: "iPhone Distribution",
          exportTeamId: "762H5V79XV",
          exportMethod: "test",
          provisioningProfileName: "Test Provisioning Profile",
          profilesDir: "./xx",
        },
      },
      kernelPluginFastlane: {
        kernel: {
          android: {
            appCenter: {
              organization: "Branding-Brand",
              appName: "TestApp-Android-Internal",
              destinationType: "test",
              destinations: ["IAT", "UAT"],
            },
          },
        },
      },
    };
    await android(androidConfig as never);
    const androidCases = [
      `owner_name: "${androidConfig.kernelPluginFastlane.kernel.android.appCenter.organization}"`,
      `app_name: "${androidConfig.kernelPluginFastlane.kernel.android.appCenter.appName}"`,
      `version: "${androidConfig.android.versioning.version}"`,
      `destination_type: "${androidConfig.kernelPluginFastlane.kernel.android.appCenter.destinationType}"`,
      `destinations: "${androidConfig.kernelPluginFastlane.kernel.android.appCenter.destinations}"`,
    ];
    const result = await fs.readFile(
      path.resolve(
        __dirname,
        "__fastlane_fixtures",
        "android",
        "fastlane",
        "Fastfile"
      ),
      "utf8"
    );
    androidCases.forEach(function (testCase) {
      expect(result).toContain(testCase);
    });
  });
});
