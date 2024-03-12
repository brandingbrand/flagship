import path from "path";
import {
  fsk,
  Config,
  path as pathk,
  summary,
  fs,
} from "@brandingbrand/code-core";
import { CodePluginFastlane } from "./types";

const ios = summary.withSummary(
  async (config: Config & CodePluginFastlane) => {
    if (config.codePluginFastlane.plugin.ios) {
      const sourcePath = path.join(__dirname, "..", "assets", "ios");
      const destPath = path.join(pathk.ios.rootDirPath());

      await fsk.copyDir(sourcePath, destPath, config, "ios", false);

      await fsk.update(
        pathk.project.resolve("ios", "Gemfile"),
        /(source[\s\S]+?\n)/,
        `$1

gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
`
      );

      if (!config.ios.signing) {
        throw Error("[CodePluginFastlane]: missing ios fastlane configuration");
      }

      // Get list of provisioning profiles files
      const files = await fs.readdir(
        pathk.config.resolve(config.ios.signing.profilesDir)
      );

      const profilesFiles = files.filter((it) =>
        it.match(/(\w+\.mobileprovision)/)
      );

      // Throw error if there are no available provisioning profiles
      if (!profilesFiles.length) {
        throw Error(
          `[CodePluginFastlane]: cannot find profiles that match *.mobileprovision in ${config.ios.signing.profilesDir}`
        );
      }

      // Reduce list into a string that would be reprentative of a ruby array
      const profiles = profilesFiles
        .map(
          (it) =>
            `'${pathk.config.resolve(
              config.ios.signing?.profilesDir as string,
              it
            )}'`
        )
        .join(",");

      await fsk.update(
        pathk.project.resolve("ios", "fastlane", "Fastfile"),
        /(@profiles\s+=\s+\[).*(\])/,
        `$1${profiles}$2`
      );

      await fsk.update(
        pathk.project.resolve("ios", "fastlane", "Fastfile"),
        /(certificate_path:\s+').*\.p12(')/,
        `$1${pathk.config.resolve(config.ios.signing?.distP12)}$2`
      );

      await fsk.update(
        pathk.project.resolve("ios", "fastlane", "Fastfile"),
        /(certificate_path:\s+').*\.cer(')/,
        `$1${pathk.config.resolve(config.ios.signing?.distCert)}$2`
      );

      await fsk.update(
        pathk.project.resolve("ios", "fastlane", "Fastfile"),
        /(certificate_path:\s+')AppleWWDRCA\.cer(')/,
        `$1${pathk.config.resolve(config.ios.signing?.appleCert)}$2`
      );
    }
  },
  "plugin-fastlane",
  "platform::ios"
);

const android = summary.withSummary(
  async (config: Config & CodePluginFastlane) => {
    if (config.codePluginFastlane.plugin.android) {
      const sourcePath = path.join(__dirname, "..", "assets", "android");
      const destPath = path.join(pathk.android.rootDirPath());

      await fsk.copyDir(sourcePath, destPath, config, "android", false);

      await fsk.update(
        pathk.project.resolve("android", "Gemfile"),
        /(source[\s\S]+?\n)/,
        `$1

gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
`
      );
    }

    if (!config.android.signing) {
      throw Error(
        "[CodePluginFastlane]: missing android signing configuration"
      );
    }

    await fs.copyFile(
      pathk.config.resolve(config.android.signing.storeFile),
      pathk.project.resolve("android", "app", "release.keystore")
    );

    await fsk.update(
      pathk.project.resolve("android", "app", "build.gradle"),
      /(signingConfigs[.\s\S]+?release \{)[.\s\S]+?\}/m,
      `$1
            storeFile file('release.keystore')
            storePassword System.getenv("STORE_PASSWORD")
            keyAlias '${config.android.signing.keyAlias}'
            keyPassword System.getenv("KEY_PASSWORD")`
    );
  },
  "plugin-fastlane",
  "platform::android"
);

export * from "./types";

export { ios, android };
