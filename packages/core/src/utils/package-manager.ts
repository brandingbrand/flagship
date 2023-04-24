import spawnAsync from "@expo/spawn-async";

import fs from "./fs";
import * as path from "./path";
import * as packageManagers from "./package-managers";

/**
 * Runs the specified callback with the appropriate package manager and run command based on which lock file exists.
 *
 * @param {function} callback - The function to run with the package manager and run command.
 * @param {function} callback.packageManager - The package manager to use (either "npm" or "yarn").
 * @param {function} callback.runCommand - The run command to use with npm (empty string) or yarn ("run").
 * @returns {Promise<void>} - A Promise that resolves when the callback function has completed.
 */
export const withPackageManager = async (
  callback: (
    packageManager: "npm" | "yarn",
    runCommand: string
  ) => Promise<void>
) => {
  if (
    await fs.pathExists(
      path.project.resolve(packageManagers.npm.constants.LOCK_FILE)
    )
  ) {
    return callback("npm", "run");
  }

  if (
    await fs.pathExists(
      path.project.resolve(packageManagers.yarn.constants.LOCK_FILE)
    )
  ) {
    return callback("yarn", "");
  }
};

/**
 * Runs the specified callback with the version of the specified package, using the appropriate package manager.
 *
 * @param {string} packageName - The name of the package to get the version for.
 * @param {function} callback - The function to run with the package version.
 * @param {function} callback.packageVersion - The version of the package (or undefined if it is not installed).
 * @returns {Promise<void>} - A Promise that resolves when the callback function has completed.
 */
export const withVersion = (
  packageName: string,
  callback: (packageVersion: string | undefined) => Promise<void>
) =>
  withPackageManager(async (packageManager) => {
    const { stdout } = await spawnAsync(packageManager, [
      "list",
      packageName,
      "--json",
    ]);

    const json = JSON.parse(stdout);

    const packageVersion = packageManagers[packageManager].list.version(
      packageName,
      json
    );

    return callback(packageVersion);
  });
