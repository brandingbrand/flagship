import chalk from 'chalk';
import {Option, program} from 'commander';
import {detect} from 'detect-package-manager';
import {AlignDepsOptions} from '@brandingbrand/code-cli-kit';

import * as actions from '@/actions';
import {config, logger} from '@/lib';

/**
 * Defines a command for aligning dependencies for a specified React Native verison
 * using the "commander" library.
 *
 * @example
 * ```bash
 * yarn flagship-code align-deps --profile 0.73
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command('align-deps')
  .description('check dependencies with respect to React Native version')
  .addOption(
    new Option('-p, --profile [profile]', 'React Native profile')
      .choices(['0.72', '0.73'])
      .makeOptionMandatory(),
  )
  .option('--f, --fix [fix]', 'Fix package.json dependencies.', false)
  .action(async (options: AlignDepsOptions) => {
    /**
     * Update the configuration generate options with the provided options and command type.
     */
    config.alignDepsOptions = {...options, command: 'align-deps'};

    /**
     * Loop through predefined actions and execute them sequentially.
     */
    for (const action of [actions.info, actions.dependencies]) {
      await action();
    }

    /**
     * Resume logging with console.log and process.stdout
     */
    logger.resume();
    logger.info(
      chalk.magenta`🚀 Dependencies ${options.fix ? 'fixed' : 'checked'}!\n`,
    );

    logger.info(
      chalk.gray`Useful commands:

    ${chalk.cyan((await detect()) + ` flagship-code prebuild --build <build-variant> --env <env-variant>`)}
        Generate native code for React Native app
`,
    );
  });
