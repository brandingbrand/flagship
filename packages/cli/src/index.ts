import process from 'process';

import {Command, Option} from 'commander';
import {AlignDepsOptions, logger} from '@brandingbrand/code-cli-kit';

import cliPkg from '../package.json';

import {executeAlignDeps, executePrebuild, generatePlugin} from './commands';
import {constants} from './ui/constants';

const {
  ERROR_REPORT_URL,
  CLI_NAME,
  CLI_DESCRIPTION,
  LOG_LEVEL_CHOICES,
  PLATFORM_CHOICES,
  RN_PROFILE_CHOICES,
  DEFAULT_LOG_LEVEL,
  DEFAULT_PLATFORM,
} = constants;

/**
 * Options interface for the prebuild command
 * @interface PrebuildOptions
 * @property {string} build - Build configuration identifier
 * @property {string} env - Environment name (e.g., 'development', 'production')
 * @property {('ios'|'android'|'native')} platform - Target platform for code generation
 * @property {('debug'|'log'|'info'|'warn'|'error')} logLevel - Logging verbosity level
 * @property {boolean} release - Whether to bundle only the specified environment
 * @property {boolean} verbose - Whether to show detailed stdout output
 */

// Initialize main program
const program: Command = new Command()
  .name(CLI_NAME)
  .description(CLI_DESCRIPTION)
  .version(cliPkg.version, '-v, --version', 'output the current version');

// Commands
program
  .command('align-deps')
  .description('check dependencies with respect to React Native version')
  .addOption(
    new Option('-p, --profile [profile]', 'React Native profile')
      .choices(RN_PROFILE_CHOICES)
      .makeOptionMandatory(),
  )
  .option('--f, --fix [fix]', 'Fix package.json dependencies.', false)
  .action(executeAlignDeps);

program
  .command('generate-plugin')
  .description('generate a plugin')
  .addOption(
    new Option(
      '-l --log-level [logLevel]',
      'debug, log, info, warn, error log levels.',
    )
      .choices(LOG_LEVEL_CHOICES)
      .default(DEFAULT_LOG_LEVEL),
  )
  .argument('<string>', 'name of generated plugin')
  .action(generatePlugin);

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
      .choices(PLATFORM_CHOICES)
      .default(DEFAULT_PLATFORM),
  )
  .addOption(
    new Option(
      '-l --log-level [logLevel]',
      'debug, log, info, warn, error log levels.',
    )
      .choices(LOG_LEVEL_CHOICES)
      .default(DEFAULT_LOG_LEVEL),
  )
  .option('-r, --release', 'Bundle only specified environment.', false)
  .option('--verbose', 'Show stdout.', false)
  .action(executePrebuild);

/**
 * Handles errors that occur during CLI execution
 * @async
 * @param {Error | CLIError} error - The error to handle
 * @returns {Promise<never>} Never resolves, always exits process
 * @throws {never} Never throws, handles all errors
 */
const handleError = async (error: Error): Promise<never> => {
  logger.error('CLI execution failed', 'cli');
  logger.error(
    `Unexpected error. Please report it as a bug: ${ERROR_REPORT_URL}`,
    'cli',
  );
  logger.error(`Error message: ${error.message}`, 'cli');
  if (error.stack) {
    logger.debug(`Stack trace: ${error.stack}`, 'cli');
  }

  process.exit(1);
};

// Parse and handle errors
program.parseAsync().catch(handleError);
