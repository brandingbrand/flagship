import chalk from 'chalk';
import {Option, program} from 'commander';
import {detect} from 'detect-package-manager';
import type {PrebuildOptions} from '@brandingbrand/code-cli-kit';

import * as actions from '@/actions';
import {Actions} from '@/components';
import {config, emitter, logger, prevGroup} from '@/lib';

/**
 * Defines a command for the "prebuild" operation using the "commander" library.
 * This command facilitates ephemeral native code generation for a specific build,
 * environment, and platform.
 *
 * @example
 * ```bash
 * yarn flagship-code prebuild --build internal --env staging
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command('prebuild')
  .description(
    'Ephemeral native code generation for a specific build, environment, and platform.',
  )
  .requiredOption('-b, --build [build]', 'Build configuration.')
  .requiredOption('-e, --env [env]', 'Initial environment.')
  .addOption(
    new Option(
      '-p, --platform [platform]',
      'ios, android, or native (ios & android) code generation.',
    )
      .choices(['ios', 'android', 'native'])
      .default('native'),
  )
  .option('-r, --release', 'Bundle only specified environment.', false)
  .option('--verbose', 'Show stdout.', false)
  .action(async (options: PrebuildOptions) => {
    /**
     * Update the configuration options with the provided options and command type.
     */
    config.options = {...options, command: 'prebuild'};

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
      actions.info, // emit template pending status
      actions.clean,
      actions.config,
      actions.template, // emit template success status
      actions.env, // emit env pending + success status
      actions.transformers, // emit code pending status
      actions.plugins, // emit code success status
      actions.packagers, // emit pending + success status
    ]) {
      await action();
    }

    /**
     * This is the last action to be run - if the execution gets to this point
     * it can be assumed that it was successful.
     */
    emitter.emit('action', {name: prevGroup, status: 'success'});

    /**
     * Unmount react ink components
     */
    unmount();

    /**
     * Resume logging with console.log and process.stdout
     */
    logger.resume();

    logger.info(
      chalk.magenta`🚀 Generated native project(s), ready to launch your app!\n`,
    );

    logger.info(
      chalk.gray`Useful commands:

    ${chalk.cyan((await detect()) + ` react-native run-ios`)}
        Run your iOS app locally

    ${chalk.cyan((await detect()) + ` react-native run-andorid`)}
        Run your Android app locally

    ${chalk.cyan((await detect()) + ` react-native start`)}
        Start the Metro development server

    ${chalk.cyan((await detect()) + ` flagship-code plugin <plugin-name>`)}
        Generate a Flagship Code plugin
`,
    );
  });
