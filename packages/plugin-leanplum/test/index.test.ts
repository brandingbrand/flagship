import { fs, path } from "@brandingbrand/code-core";

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
      .spyOn(path.ios, "podfilePath")
      .mockReturnValue(
        path.resolve(__dirname, "__leanplum_fixtures", "Podfile")
      );

    jest
      .spyOn(path.ios, "appDelegatePath")
      .mockReturnValue(
        path.resolve(__dirname, "__leanplum_fixtures", "AppDelegate.mm")
      );

    await ios({
      ios: { name: "HelloWorld" },
      codePluginLeanplum: {
        plugin: {
          ios: {
            swizzle: false,
          },
        },
      },
    } as never);

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

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__leanplum_fixtures", "Podfile")
        )
      ).toString()
    ).toMatch(`
  dynamic_frameworks = ['Leanplum-iOS-SDK']
  pre_install do |installer|
    Pod::Installer::Xcode::TargetValidator.send(:define_method, :verify_no_static_framework_transitive_dependencies) {}
    installer.pod_targets.each do |pod|
      if dynamic_frameworks.include?(pod.name)
        puts "Setting dynamic linking for #{pod.name}"
        def pod.build_type;
          Pod::BuildType.dynamic_framework
        end
      end
    end
  end`);
  });

  it("android", async () => {
    jest
      .spyOn(path.android, "gradlePath")
      .mockReturnValue(
        path.resolve(__dirname, "__leanplum_fixtures", "build.gradle")
      );

    jest
      .spyOn(path.android, "mainApplicationPath")
      .mockReturnValue(
        path.resolve(__dirname, "__leanplum_fixtures", "MainApplication.java")
      );

    await android({ android: { packageName: "com.helloworld" } } as never);

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__leanplum_fixtures", "build.gradle")
        )
      ).toString()
    ).toMatch("implementation 'com.leanplum:leanplum-fcm:5.7.0'");

    expect(
      (
        await fs.readFile(
          path.resolve(__dirname, "__leanplum_fixtures", "build.gradle")
        )
      ).toString()
    ).toMatch("implementation 'com.google.firebase:firebase-messaging'");
  });
});
