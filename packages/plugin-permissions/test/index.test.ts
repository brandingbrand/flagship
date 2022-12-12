import { path, fs } from "@brandingbrand/kernel-core";

import { ios, android } from "../src";

describe("plugin-permissions", () => {
  beforeAll(async () => {
    return fs.copy(
      path.resolve(__dirname, "fixtures"),
      path.resolve(__dirname, "__permissions_fixtures")
    );
  });

  afterAll(async () => {
    return fs.remove(path.resolve(__dirname, "__permissions_fixtures"));
  });

  it("ios", async () => {
    jest
      .spyOn(path.ios, "infoPlistPath")
      .mockReturnValue(
        path.resolve(__dirname, "__permissions_fixtures", "Info.plist")
      );
    jest
      .spyOn(path.ios, "podfilePath")
      .mockReturnValue(
        path.resolve(__dirname, "__permissions_fixtures", "Podfile")
      );

    await ios({
      kernelPluginPermissions: {
        kernel: {
          ios: [
            {
              permission: "APP_TRACKING_TRANSPARENCY",
              text: "This is a test",
            },
          ],
        },
      },
    });

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__permissions_fixtures", "Podfile")
        )
      ).toString()
    ).toMatch("AppTrackingTransparency");
    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__permissions_fixtures", "Info.plist")
        )
      ).toString()
    ).toMatch("NSUserTrackingUsageDescription");
  });

  it("android", async () => {
    jest
      .spyOn(path.android, "manifestPath")
      .mockReturnValue(
        path.resolve(__dirname, "__permissions_fixtures", "AndroidManifest.xml")
      );

    await android({
      kernelPluginPermissions: {
        kernel: {
          android: ["ACCESS_FINE_LOCATION"],
        },
      },
    });

    expect(
      (
        await fs.readFile(
          path.resolve(
            __dirname,
            "__permissions_fixtures",
            "AndroidManifest.xml"
          )
        )
      ).toString()
    ).toMatch("ACCESS_FINE_LOCATION");
  });
});
