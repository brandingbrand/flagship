import ansiAlign from 'ansi-align';
import ci from 'ci-info';
import chalk from 'chalk';
import updateCheck from 'update-check';
import {isWindows} from '@brandingbrand/code-cli-kit';

import pkg from '../../package.json';

import {config, defineAction, isAlignDepsCommand, logger} from '@/lib';

/**
 * Executes the default action, providing detailed information and performing necessary checks.
 * @remarks
 * This action logs information about the current environment, checks if the script is running on Windows,
 * detects if it's running in a CI environment, and checks for package updates.
 * @returns Promise<void>
 */
export default defineAction(
  async () => {
    // Log cli details
    console.log(chalk.blue`

          ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
          ▒▒                   ▒▒▒
          ▒▒                 ▒▒▒
          ▒▒               ▒▒▒
          ▒▒             ▒▒▒
          ▒▒           ▒▒▒
          ▒▒         ▒▒▒
          ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
          ▒▒     ▒▒▒           ▒▒▒
          ▒▒   ▒▒▒           ▒▒▒
          ▒▒ ▒▒▒           ▒▒▒
          ▒▒▒▒           ▒▒▒
          ▒▒           ▒▒▒
          ▒▒         ▒▒▒
          ▒▒       ▒▒▒
          ▒▒     ▒▒▒
          ▒▒   ▒▒▒
          ▒▒ ▒▒▒
          ▒▒▒▒

`);

    logger.info(
      ansiAlign([
        chalk.bold.blue`Flagship Code ${chalk.bold.white`v${pkg.version}`}`,
        chalk.dim`Configurable - Extensible - Toolkit`,
      ]).join('\n'),
    );

    // Check if the script is running on Windows, and throw an error if it is
    if (isWindows) {
      logger.error(`${pkg.name} is unable to run on a windows machine.`);

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

    // Pause logs when not in CI in favor of react-ink
    if (!ci.isCI && !config.options.verbose && !isAlignDepsCommand) {
      logger.pause();
    }
  },
  'info',
  'template',
);
