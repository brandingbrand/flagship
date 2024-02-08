/**
 * Imports the 'os' module from Node.js.
 */
import os from "os";

/**
 * Imports the 'ci-info' module for detecting CI environments.
 */
import ci from "ci-info";

/**
 * Imports the 'update-check' module for checking package updates.
 */
import updateCheck from "update-check";

/**
 * Imports the 'isWindows' function from the '@brandingbrand/code-cli-kit' package.
 */
import { isWindows } from "@brandingbrand/code-cli-kit";

/**
 * Imports the 'pkg' object from the package.json file located at '../../package.json'.
 */
import pkg from "../../package.json";

/**
 * Imports the 'config', 'defineAction', 'logInfo', and 'logWarn' functions from the '@/lib' module.
 */
import { config, defineAction, logInfo, logWarn } from "@/lib";

/**
 * Executes the default action, providing detailed information and performing necessary checks.
 * @remarks
 * This action logs information about the current environment, checks if the script is running on Windows,
 * detects if it's running in a CI environment, and checks for package updates.
 * @returns Promise<void>
 */
export default defineAction(async () => {
  await logInfo(`\nUsing ${pkg.name} v${pkg.version}`);
  await logInfo(`Running command: ${config.options.command}`);
  await logInfo(`Running on ${os.platform}`);

  // Check if the script is running on Windows, and throw an error if it is
  if (isWindows) {
    throw Error("[InfoActionError]: unable to run on windows machine");
  }

  // Check if the script is running in a CI environment, and log the CI server name if it is
  if (ci.isCI) {
    await logInfo(`Running on ${ci.name} Continuous Integration server`);
  }

  // Check for package updates
  const update = await updateCheck({
    name: pkg.name,
    version: pkg.version,
  });

  // Warn for new version available
  if (update) {
    await logWarn(
      `\nNew version available ${pkg.name} v${pkg.version} -> ${update.latest}\n`
    );
  }
}, "info");
