import process from 'process';

import chalk from 'chalk';
import {Command, Option} from 'commander';
import {
  PrebuildOptions,
  AlignDepsOptions,
  logger,
} from '@brandingbrand/code-cli-kit';

import cliPkg from '../package.json';

import globalEmitter from './events';
import {findBuildConfigFiles, loadFlagshipCodeConfig} from './configs';
import {renderStatus} from './renderer';

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

/**
 * Base URL for reporting issues
 * @constant {string}
 */
const ERROR_REPORT_URL = 'https://github.com/brandingbrand/flagship/issues';

/**
 * Name of the CLI tool
 * @constant {string}
 */
const CLI_NAME = 'flagship-code';

/**
 * Description of the CLI tool's purpose
 * @constant {string}
 */
const CLI_DESCRIPTION =
  'command-line interface for ephemeral native code generation';

/**
 * Available log level options
 * @constant {readonly string[]}
 */
const LOG_LEVEL_CHOICES = ['debug', 'log', 'info', 'warn', 'error'] as const;

/**
 * Available platform choices for code generation
 * @constant {readonly string[]}
 */
const PLATFORM_CHOICES = ['ios', 'android', 'native'] as const;

/**
 * Supported React Native version profiles
 * @constant {readonly string[]}
 */
const RN_PROFILE_CHOICES = [
  '0.72',
  '0.73',
  '0.74',
  '0.75',
  '0.76',
  '0.77',
  '0.78',
] as const;

/**
 * Default logging level for commands
 * @constant {string}
 */
const DEFAULT_LOG_LEVEL = 'info';

/**
 * Default platform for code generation
 * @constant {string}
 */
const DEFAULT_PLATFORM = 'native';

/**
 * Custom error class for CLI-specific errors
 * @class CLIError
 * @extends Error
 */
class CLIError extends Error {
  /**
   * Creates a new CLIError instance
   * @param {string} message - Error message
   * @param {string} [code] - Error code for categorization
   */
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'CLIError';
  }
}

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
  .action((options: AlignDepsOptions) => {
    // Command implementation moved to separate file
  });

program
  .command('plugin')
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
  .action((str: string, options: any) => {
    // Command implementation moved to separate file
  });

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
  .action(async (options: PrebuildOptions) => {
    const buildConfig = await findBuildConfigFiles(
      process.cwd(),
      options.build,
    );
    const {plugins} = await loadFlagshipCodeConfig();

    await renderStatus({
      numberOfPlugins: plugins.reduce((acc, curr) => {
        return acc + Object.keys(curr.plugin).length;
      }, 0),
      cmd: 'prebuild',
    });

    logger.setLogLevel(logger.getLogLevelFromString(options.logLevel));
    if (!options.verbose) logger.pause();
    logger.printCmdOptions(options, 'prebuild');

    const sortedPlugins = plugins
      .map((plugin, originalIndex) => ({
        plugin,
        index:
          plugin.options?.index !== undefined
            ? plugin.options.index
            : originalIndex, // Use explicit index if available, otherwise preserve order
      }))
      .sort((a, b) => a.index - b.index) // Sort in descending order
      .map(({plugin}) => plugin);

    for (const plugin of sortedPlugins) {
      const {name, plugin: scripts} = plugin;

      try {
        // Run common script if it exists
        if (scripts.common) {
          logger.debug(`Running common script for plugin: ${name}`);
          await scripts.common(buildConfig, options);
          globalEmitter.emit('onRun');
        }

        // Run platform-specific scripts
        if (options.platform === 'ios' || options.platform === 'native') {
          if (scripts.ios) {
            logger.debug(`Running iOS script for plugin: ${name}`);
            await scripts.ios(buildConfig, options);
            globalEmitter.emit('onRun');
          }
        }

        if (options.platform === 'android' || options.platform === 'native') {
          if (scripts.android) {
            logger.debug(`Running Android script for plugin: ${name}`);
            await scripts.android(buildConfig, options);
            globalEmitter.emit('onRun');
          }
        }
      } catch (error) {
        globalEmitter.emit('onError');
        throw Error(`Failed to run scripts for plugin "${name}": ${error}`);
      }
    }

    globalEmitter.emit('onEnd');
    logger.resume();
    global.unmount?.();
  });

/**
 * Handles errors that occur during CLI execution
 * @async
 * @param {Error | CLIError} error - The error to handle
 * @returns {Promise<never>} Never resolves, always exits process
 * @throws {never} Never throws, handles all errors
 */
const handleError = async (error: Error | CLIError): Promise<never> => {
  console.log();

  if (error instanceof CLIError) {
    console.log(chalk.red(`CLI Error (${error.code}): ${error.message}`));
  } else {
    console.log(
      chalk.red(
        `Unexpected error. Please report it as a bug: ${ERROR_REPORT_URL}`,
      ),
    );
    console.log(chalk.yellow('Error message:'), error.message);
    if (error.stack) {
      console.log(chalk.gray('Stack trace:'), error.stack);
    }
  }

  console.log();
  process.exit(1);
};

// Parse and handle errors
program.parseAsync().catch(handleError);
