import spawnAsync from "@expo/spawn-async";

import fs from "./fs";
import * as path from "./path";
import * as packageManagers from "./package-managers";

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
