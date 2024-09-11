import {Option, program} from 'commander';
import {
  AlignDepsOptions,
  FlagshipCodeManager,
  logger,
} from '@brandingbrand/code-cli-kit';

import * as actions from '@/actions';
import {config} from '@/lib';
import {Status} from '@/components';

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

    const {render} = await import('ink');

    await new Promise(res => {
      /**
       * Render the Reporter component to display progress.
       */
      const {unmount} = render(<Status res={res} />, {stdout: process.stderr});

      global.unmount = unmount;
    });

    logger.pause();
    logger.printCmdOptions(options, 'align-deps');

    FlagshipCodeManager.shared
      .addAction(actions.info)
      .addAction(actions.dependencies);

    await FlagshipCodeManager.shared.run();

    logger.info(`Dependencies ${options.fix ? 'fixed' : 'checked'}!`);

    /**
     * Resume logging with console.log and process.stdout
     */
    logger.resume();

    global.unmount?.();
  });
