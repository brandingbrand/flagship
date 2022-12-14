import { fs, path } from "@brandingbrand/kernel-core";

import { ios, android } from "../src";

describe("plugin-leanplum", () => {
  beforeAll(async () => {
    return fs.copy(
      path.resolve(__dirname, "fixtures"),
      path.resolve(__dirname, "__leanplum_fixtures")
    );
  });

  afterAll(async () => {
    return fs.remove(path.resolve(__dirname, "__leanplum_fixtures"));
  });

  it("ios", async () => {
    jest
      .spyOn(path.ios, "infoPlistPath")
      .mockReturnValue(
        path.resolve(__dirname, "__leanplum_fixtures", "Info.plist")
      );

    jest
      .spyOn(path.ios, "appDelegatePath")
      .mockReturnValue(
        path.resolve(__dirname, "__leanplum_fixtures", "AppDelegate.mm")
      );

    await ios({
      kernelPluginLeanplum: {
        kernel: {
          ios: {
            swizzle: false,
          },
        },
      },
    });

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__leanplum_fixtures", "Info.plist")
        )
      ).toString()
    ).toMatch("LeanplumSwizzlingEnabled");

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__leanplum_fixtures", "AppDelegate.mm")
        )
      ).toString()
    ).toMatch("didRegisterForRemoteNotificationsWithDeviceToken");
  });

  it("android", async () => {
    jest
      .spyOn(path.android, "gradlePath")
      .mockReturnValue(
        path.resolve(__dirname, "__leanplum_fixtures", "build.gradle")
      );

    await android({});

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__leanplum_fixtures", "build.gradle")
        )
      ).toString()
    ).toMatch("implementation 'com.leanplum:leanplum-fcm:5.3.3'");

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__leanplum_fixtures", "build.gradle")
        )
      ).toString()
    ).toMatch("implementation 'com.google.firebase:firebase-messaging'");
  });
});
