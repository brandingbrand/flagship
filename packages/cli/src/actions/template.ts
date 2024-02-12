import fse from "fs-extra";
import { canRunAndroid, canRunIOS, path } from "@brandingbrand/code-cli-kit";

import { config, defineAction } from "@/lib";

/**
 * Define an action to initialize a project template.
 * @remarks
 * This action copies template files for iOS and Android platforms to the project directory based on the provided configuration options.
 * It requires the 'fs-extra' package for file system operations and uses utility functions from '@brandingbrand/code-cli-kit' for platform checks and path manipulation.
 * @returns {Promise<void>} - Promise that resolves when the action completes successfully.
 * @throws {Error} - Throws an error if there's an issue with creating directories or copying template files.
 */
export default defineAction(async () => {
  // Get the path to the template directory of the '@brandingbrand/code-cli' package
  const templatePath = path.join(
    require.resolve("@brandingbrand/code-cli/package.json"),
    "..",
    "template"
  );

  // Check if the configuration allows running for iOS platform
  if (canRunIOS(config.options)) {
    // Create directories for iOS platform
    await fse.mkdir(path.project.resolve("ios"));

    // Copy over iOS template to ios directory
    await fse.copy(
      path.resolve(templatePath, "ios"),
      path.project.resolve("ios")
    );
  }

  // Check if the configuration allows running for Android platform
  if (canRunAndroid(config.options)) {
    // Create directories for Android platform
    await fse.mkdir(path.project.resolve("android"));

    // Copy template files for Android platform to the project directory
    await fse.copy(
      path.resolve(templatePath, "android"),
      path.project.resolve("android")
    );
  }

  // Copy extra template files to the project directory based on platform availability
  await fse.copy(path.resolve(templatePath, "extras"), path.project.resolve(), {
    filter: function (path) {
      // Filter out Android files if Android platform is not enabled
      if (!canRunAndroid(config.options) && path.indexOf("android") > -1) {
        return false;
      }

      // Filter out iOS files if iOS platform is not enabled
      if (!canRunIOS(config.options) && path.indexOf("ios") > -1) {
        return false;
      }

      return true;
    },
  });
}, "template");
