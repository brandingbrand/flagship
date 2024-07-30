import ansiAlign from 'ansi-align';
import ci from 'ci-info';
import updateCheck from 'update-check';
import {isWindows, logger} from '@brandingbrand/code-cli-kit';

import pkg from '../../package.json';

import {defineAction} from '@/lib';

/**
 * Executes the default action, providing detailed information and performing necessary checks.
 * @remarks
 * This action logs information about the current environment, checks if the script is running on Windows,
 * detects if it's running in a CI environment, and checks for package updates.
 * @returns Promise<void>
 */
export default defineAction(async () => {
  // Check if the script is running on Windows, and throw an error if it is
  if (isWindows) {
    throw Error('[InfoActionError]: unable to run on windows machine');
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
      `A new version of ${pkg.name} is available: v${pkg.version} -> v${update.latest}`,
    );
  }
});
