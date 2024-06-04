import chalk from 'chalk';
import {program} from 'commander';
import {detect} from 'detect-package-manager';
import {type GenerateOptions} from '@brandingbrand/code-cli-kit';

import * as actions from '@/actions';
import {Actions} from '@/components';
import {config, emitter, logger} from '@/lib';

/**
 * Defines a command for generating a flagship-code template using the "commander" library.
 * This command allows users to generate templates with specified types and names.
 *
 * @example
 * ```bash
 * yarn flagship-code plugin my-plugin
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command('plugin')
  .description('generate a plugin')
  .argument('<string>', 'name of generated plugin')
  .action(async (str: string, options: GenerateOptions) => {
    /**
     * Update the configuration generate options with the provided options and command type.
     */
    config.generateOptions = {...options, name: str, command: 'generate'};

    const {render} = await import('ink');

    /**
     * Render the Reporter component to display progress.
     */
    const {unmount} = render(<Actions />, {stdout: process.stderr});

    global.unmount = unmount;

    /**
     * Loop through predefined actions and execute them sequentially.
     */
    for (const action of [
      actions.info,
      actions.config,
      actions.template,
      actions.generator,
      actions.packagers,
    ]) {
      await action();
    }

    /**
     * This is the last action to be run - if the execution gets to this point
     * it can be assumed that it was successful.
     */
    emitter.emit('action', {name: 'dependencies', status: 'success'});

    /**
     * Unmount react ink components
     */
    unmount();

    /**
     * Resume logging with console.log and process.stdout
     */
    logger.resume();
    logger.info(chalk.magenta`🚀 Generated ${str} plugin!\n`);

    logger.info(
      chalk.gray`Useful commands:

    ${chalk.cyan((await detect()) + ` flagship-code prebuild --build <build-variant> --env <env-variant>`)}
        Generate native code for React Native app
`,
    );
  });
