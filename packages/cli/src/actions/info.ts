/**
 * Imports the 'os' module from Node.js for detecting runtime platform.
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
import {
  config,
  defineAction,
  isGenerateCommand,
  isPrebuildCommand,
  logger,
} from "@/lib";

/**
 * Executes the default action, providing detailed information and performing necessary checks.
 * @remarks
 * This action logs information about the current environment, checks if the script is running on Windows,
 * detects if it's running in a CI environment, and checks for package updates.
 * @returns Promise<void>
 */
export default defineAction(async () => {
  // Log cli details
  console.log(`
███████╗██╗      █████╗  ██████╗ ███████╗██╗  ██╗██╗██████╗ 
██╔════╝██║     ██╔══██╗██╔════╝ ██╔════╝██║  ██║██║██╔══██╗
█████╗  ██║     ███████║██║  ███╗███████╗███████║██║██████╔╝
██╔══╝  ██║     ██╔══██║██║   ██║╚════██║██╔══██║██║██╔═══╝ 
██║     ███████╗██║  ██║╚██████╔╝███████║██║  ██║██║██║     
╚═╝     ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝╚═╝     
`);
  logger.info(`Using ${pkg.name} v${pkg.version}`);
  logger.info(`Running on platform: ${os.platform}`);

  if (isPrebuildCommand()) {
    logger.info(
      `Using options: \n${JSON.stringify(config.options, null, 5).replace(/({|})/g, "   $1")}`
    );
  }

  if (isGenerateCommand()) {
    logger.info(
      `Using options: \n${JSON.stringify(config.generateOptions, null, 5).replace(/({|})/g, "   $1")}`
    );
  }

  // Check if the script is running on Windows, and throw an error if it is
  if (isWindows) {
    logger.error(`${pkg.name} is unable to run on a windows machine.`);

    throw Error("[InfoActionError]: unable to run on windows machine");
  }

  // Check if the script is running in a CI environment, and log the CI server name if it is
  if (ci.isCI) {
    logger.info(`Continuous Integration server: ${ci.name}`);
  }

  // Check for package updates
  const update = await updateCheck({
    name: pkg.name,
    version: pkg.version,
  });

  // Warn for new version available
  if (update) {
    logger.warn(
      `A new version of ${pkg.name} is available: v${pkg.version} -> v${update.latest}`
    );
  }

  logger.start("Generating native code...");

  // Pause logs when not in CI in favor of react-ink
  if (!ci.isCI) {
    logger.pause();
  }
}, "info");
