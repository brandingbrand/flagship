import {Option, program} from 'commander';
import {
  type PrebuildOptions,
  FlagshipCodeManager,
  logger,
} from '@brandingbrand/code-cli-kit';
import ansiAlign from 'ansi-align';

import * as actions from '@/actions';
import {
  config,
  FLAGSHIP_CODE_DESCRIPTION,
  FLAGSHIP_CODE_LOGO,
  FLAGSHIP_CODE_TITLE,
} from '@/lib';
import {Status} from '@/components/Status';

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
  .addOption(
    new Option(
      '-l --log-level [logLevel]',
      'debug, log, info, warn, error log levels.',
    )
      .choices(['debug', 'log', 'info', 'warn', 'error'])
      .default('info'),
  )
  .option('-r, --release', 'Bundle only specified environment.', false)
  .option('--verbose', 'Show stdout.', false)
  .action(async (options: PrebuildOptions) => {
    /**
     * Update the configuration options with the provided options and command type.
     */
    config.options = {...options, command: 'prebuild'};

    const {render} = await import('ink');

    await new Promise(res => {
      /**
       * Render the Reporter component to display progress.
       */
      const {unmount} = render(<Status res={res} />, {stdout: process.stderr});

      global.unmount = unmount;
    });

    logger.setLogLevel(logger.getLogLevelFromString(options.logLevel));

    if (!options.verbose) {
      logger.pause();
    }

    process.stdout.write(FLAGSHIP_CODE_LOGO + '\n\n');
    process.stdout.write(
      ansiAlign([FLAGSHIP_CODE_TITLE, FLAGSHIP_CODE_DESCRIPTION]).join('\n') +
        '\n\n',
    );

    logger.printCmdOptions(options, 'prebuild');

    FlagshipCodeManager.shared
      .addAction(actions.info)
      .addAction(actions.clean)
      .addAction(actions.config)
      .addAction(actions.template)
      .addAction(actions.env)
      .addAction(actions.transformers)
      .addAction(actions.plugins)
      .addAction(actions.packagers);

    await FlagshipCodeManager.shared.run();

    /**
     * Resume logging with console.log and process.stdout
     */
    logger.resume();

    global.unmount?.();
  });
