import chalk from 'chalk';
import {Option, program} from 'commander';
import {detect} from 'detect-package-manager';

import * as actions from '@/actions';
import {Actions} from '@/components';
import {emitter, logger} from '@/lib';

/**
 * Defines a command for aligning dependencies for a specified React Native verison
 * using the "commander" library.
 *
 * @example
 * ```bash
 * yarn flagship-code deps-check --profile 0.73
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
  .action(async () => {
    const {render} = await import('ink');

    /**
     * Render the Reporter component to display progress.
     */
    const {unmount} = render(<Actions />, {stdout: process.stderr});

    global.unmount = unmount;

    /**
     * Loop through predefined actions and execute them sequentially.
     */
    for (const action of [actions.info, actions.dependencies]) {
      await action();
    }

    /**
     * This is the last action to be run - if the execution gets to this point
     * it can be assumed that it was successful.
     */
    emitter.emit('action', {name: 'template', status: 'success'});

    /**
     * Unmount react ink components
     */
    unmount();

    /**
     * Resume logging with console.log and process.stdout
     */
    logger.resume();
    logger.info(chalk.magenta`🚀 Dependencies checked!\n`);

    logger.info(
      chalk.gray`Useful commands:

    ${chalk.cyan((await detect()) + ` flagship-code prebuild --build <build-variant> --env <env-variant>`)}
        Generate native code for React Native app
`,
    );
  });
