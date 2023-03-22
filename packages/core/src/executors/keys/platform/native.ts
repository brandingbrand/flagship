import { exec, path, fs } from "../../../utils";

import type { Config } from "../../../types/Config";
import type { KeysOptions } from "../../../types/Options";

export const execute = (options: KeysOptions, config: Config) => ({
  ios: async () => {
    const keychainName = process.env.KEY_CHAIN || "login.keychain";
    const keychain = `~/Library/Keychains/${keychainName}`;
    console.log(`keychain is ${keychain}`);

    const { DISTRIBUTION_CERT_PASS } = process.env;

    if (!DISTRIBUTION_CERT_PASS) {
      console.error("DISTRIBUTION_CERT_PASS environment variable is required");

      process.exit(1);
    }

    let projectEnv = null;

    try {
      projectEnv = require(path.project.resolve(
        path.config.envPath(),
        "env.js"
      )).default;
    } catch {
      console.error("env/env.js not found, did you init your project?");

      process.exit(1);
    }

    const buildConfig = projectEnv && projectEnv.ios && projectEnv.ios.signing;

    if (
      !(
        buildConfig &&
        buildConfig.appleCert &&
        buildConfig.distCert &&
        buildConfig.distP12 &&
        buildConfig.profilesDir
      )
    ) {
      console.error(
        "buildConfig.ios does not exist in the active environment. Please see " +
          "https://github.com/brandingbrand/flagship/wiki/Signing-Your-Apps for more information."
      );

      process.exit(1);
    }

    // add certificates and provisioning profiles to computer
    await exec.async(
      `security import ${path.config.resolve(
        buildConfig.appleCert
      )} -k ${keychain} -T /usr/bin/codesign || true`
    );

    // add keys for internal build
    // - import distribution certificate
    await exec.async(
      `security import ${path.config.resolve(
        buildConfig.distCert
      )} -k ${keychain} -T /usr/bin/codesign || true`
    );

    // - import private key
    await exec.async(
      `security import ${path.config.resolve(
        buildConfig.distP12
      )} -k ${keychain} -P '${DISTRIBUTION_CERT_PASS}' \
-T /usr/bin/codesign || true`
    );

    await exec.async(
      `mkdir -p ~/Library/MobileDevice/Provisioning\\ Profiles/`
    );

    await exec.async(
      `cp ${path.config.resolve(
        buildConfig.profilesDir
      )}/* ~/Library/MobileDevice/Provisioning\\ Profiles/`
    );
  },
  android: async () => {
    let projectEnv = null;

    try {
      projectEnv = require(path.project.resolve(
        path.config.envPath(),
        "env.js"
      )).default;
    } catch {
      console.error("env/env.js not found, did you init your project?");

      process.exit(1);
    }

    const { STORE_PASSWORD } = process.env;
    const { KEY_PASSWORD } = process.env;

    if (!STORE_PASSWORD) {
      console.error("STORE_PASSWORD environment variable is required");

      process.exit(1);
    }

    if (!KEY_PASSWORD) {
      console.error("KEY_PASSWORD environment variable is required");

      process.exit(1);
    }

    const buildConfig =
      projectEnv && projectEnv.android && projectEnv.android.signing;

    if (!(buildConfig && buildConfig.storeFile && buildConfig.keyAlias)) {
      console.error(
        "buildConfig.android does not exist in the active environment. Please see " +
          "https://github.com/brandingbrand/flagship/wiki/Signing-Your-Apps for more information."
      );
    }

    if (buildConfig && buildConfig.storeFile && buildConfig.keyAlias) {
      await fs.appendFile(
        path.android.gradlePropertiesPath(),
        `
  MYAPP_RELEASE_STORE_FILE=${path.config.resolve(buildConfig.storeFile)}
  MYAPP_RELEASE_KEY_ALIAS=${buildConfig.keyAlias}
  MYAPP_RELEASE_STORE_PASSWORD=${STORE_PASSWORD}
  MYAPP_RELEASE_KEY_PASSWORD=${KEY_PASSWORD}`
      );

      console.log(
        `\nDONE: Android keystore config added to gradle.properties [${buildConfig.storeFile}].\n`
      );
    }
  },
});
