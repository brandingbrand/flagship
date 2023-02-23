import xcode from "xcode";
import { fs, path, Xcode } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-firebase-app", () => {
  beforeAll(async () => {
    return fs.copy(
      path.resolve(__dirname, "fixtures"),
      path.resolve(__dirname, "__firebase_app_fixtures")
    );
  });

  afterAll(async () => {
    return fs.remove(path.resolve(__dirname, "__firebase_app_fixtures"));
  });

  it("ios", async () => {
    jest.spyOn(fs, "copy").mockImplementation(() => ({}));

    jest
      .spyOn(path.ios, "appDelegatePath")
      .mockReturnValue(
        path.resolve(__dirname, "__firebase_app_fixtures", "AppDelegate.mm")
      );

    jest
      .spyOn(path.ios, "pbxprojFilePath")
      .mockReturnValue(
        path.resolve(__dirname, "__firebase_app_fixtures", "project.pbxproj")
      );

    jest
      .spyOn(Xcode.prototype, "addResourceFileBuilder")
      .mockImplementation(() => {
        return {
          build: jest.fn(),
        } as never;
      });

    jest.spyOn(xcode, "project").mockImplementation(() => {
      return {
        parseSync: jest.fn(),
      } as never;
    });

    await ios({
      ios: { name: "HelloWorld" },
      codePluginFirebaseApp: {
        plugin: {
          ios: {
            googleServicesPath: "firebase/GoogleServices-Info.plist",
          },
        },
      },
    } as never);

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__firebase_app_fixtures", "AppDelegate.mm")
        )
      ).toString()
    ).toMatch("#import <Firebase.h>");

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__firebase_app_fixtures", "AppDelegate.mm")
        )
      ).toString()
    ).toMatch("[FIRApp configure];");
  });

  it("android", async () => {
    jest.spyOn(fs, "copy").mockImplementation(() => ({}));

    jest
      .spyOn(path.project, "resolve")
      .mockReturnValue(
        path.resolve(__dirname, "__firebase_app_fixtures", "pbuild.gradle")
      );

    jest
      .spyOn(path.android, "gradlePath")
      .mockReturnValue(
        path.resolve(__dirname, "__firebase_app_fixtures", "mbuild.gradle")
      );

    await android({
      codePluginFirebaseApp: {
        plugin: {
          android: {
            firebaseBomVersion: "31.0.0",
            googleServicesVersion: "4.3.1",
            googleServicesPath: "firebase/google-services.json",
          },
        },
      },
    });

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__firebase_app_fixtures", "pbuild.gradle")
        )
      ).toString()
    ).toMatch("classpath 'com.google.gms:google-services:4.3.1'");

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__firebase_app_fixtures", "mbuild.gradle")
        )
      ).toString()
    ).toMatch("apply plugin: 'com.google.gms.google-services'");

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__firebase_app_fixtures", "mbuild.gradle")
        )
      ).toString()
    ).toMatch(
      "implementation platform('com.google.firebase:firebase-bom:31.0.0')"
    );
  });
});
