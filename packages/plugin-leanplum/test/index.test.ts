/**
 * @jest-environment-options {"fixture": "__plugin-leanplum_fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-leanplum", () => {
  it("ios", async () => {
    await ios({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      codePluginLeanplum: {
        plugin: {
          ios: {
            swizzle: false,
          },
        },
      },
    });

    expect(
      (
        await fs.readFile(
          path.ios.infoPlistPath(global.__FLAGSHIP_CODE_CONFIG__)
        )
      ).toString()
    ).toMatch("LeanplumSwizzlingEnabled");

    expect(
      (
        await fs.readFile(
          path.ios.appDelegatePath(global.__FLAGSHIP_CODE_CONFIG__)
        )
      ).toString()
    ).toMatch("didRegisterForRemoteNotificationsWithDeviceToken");

    expect((await fs.readFile(path.ios.podfilePath())).toString()).toMatch(`
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
    await android(global.__FLAGSHIP_CODE_CONFIG__);

    const buildGradle = (
      await fs.readFile(path.android.gradlePath())
    ).toString();
    const mainApplication = (
      await fs.readFile(
        path.android.mainApplicationPath(global.__FLAGSHIP_CODE_CONFIG__)
      )
    ).toString();

    expect(buildGradle).toMatch(
      "implementation 'com.leanplum:leanplum-fcm:5.7.0'"
    );
    expect(buildGradle).toMatch(
      "implementation 'com.google.firebase:firebase-messaging'"
    );
    expect(mainApplication).toMatch("import com.leanplum.Leanplum;");
    expect(mainApplication).toMatch("import com.leanplum.annotations.Parser;");
    expect(mainApplication).toMatch(
      "import com.leanplum.LeanplumActivityHelper;"
    );
    expect(mainApplication).toMatch("Leanplum.setApplicationContext(this);");
    expect(mainApplication).toMatch("Parser.parseVariables(this);");
    expect(mainApplication).toMatch(
      "LeanplumActivityHelper.enableLifecycleCallbacks(this);"
    );
  });
});
