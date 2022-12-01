/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { basename } from "path";

import {exec, path, fs } from "../../../utils";

export const execute = (options: any, config: any, cliPath: string) => ({
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
      ));
    } catch {
      console.error("env/env.js not found, did you init your project?");

      process.exit(1);
    }

    const buildConfig =
      projectEnv && projectEnv.buildConfig && projectEnv.buildConfig.ios;

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
      `security import ${path.project.resolve(
        path.config.path(),
        buildConfig.appleCert
      )} -k ${keychain} -T /usr/bin/codesign || true`
    );

    // add keys for internal build
    // - import distribution certificate
    await exec.async(
      `security import ${path.project.resolve(
        path.config.path(),
        buildConfig.distCert
      )} -k ${keychain} -T /usr/bin/codesign || true`
    );

    // - import private key
    await exec.async(
      `security import ${path.project.resolve(
        path.config.path(),
        buildConfig.distP12
      )} -k ${keychain} -P '${DISTRIBUTION_CERT_PASS}' \
-T /usr/bin/codesign || true`
    );

    await exec.async(`mkdir -p ~/Library/MobileDevice/Provisioning\\ Profiles/`);

    await exec.async(
      `cp ${path.project.resolve(
        path.config.path(),
        buildConfig.profilesDir
      )}/* ~/Library/MobileDevice/Provisioning\\ Profiles/`
    );
  },
  android: async () => {
    let projectEnv = null;

    const copyKeystore = async (pathName: string): Promise<void> => {
      const filename = basename(pathName);
      const from = path.project.resolve(path.config.path(), pathName);
      const to = path.project.resolve("android", "app", filename);

      try {
        await fs.copy(from, to);
      } catch {
        console.error(`ERROR: keystore [${from}] not found`);
        process.exit(1);
      }
    };

    try {
      projectEnv = require(path.project.resolve(
        path.config.envPath(),
        "env.js"
      ));
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
      projectEnv && projectEnv.buildConfig && projectEnv.buildConfig.android;

    if (!(buildConfig && buildConfig.storeFile && buildConfig.keyAlias)) {
      console.error(
        "buildConfig.android does not exist in the active environment. Please see " +
          "https://github.com/brandingbrand/flagship/wiki/Signing-Your-Apps for more information."
      );
    }

    const gradlePropertiesPath = path.project.resolve(
      "android",
      "gradle.properties"
    );

    if (buildConfig && buildConfig.storeFile) {
      // add keystore setting to {project}/android/gradle.properties
      await copyKeystore(buildConfig.storeFile);
      await fs.appendFile(
        gradlePropertiesPath,
        `
  MYAPP_RELEASE_STORE_FILE=${path.project.resolve(
    path.config.path(),
    buildConfig.storeFile
  )}
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
