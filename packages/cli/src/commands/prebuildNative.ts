import {PrebuildOptions, logger} from '@brandingbrand/code-cli-kit';

import {findBuildConfigFiles} from '../core/config/buildConfig';
import {loadFlagshipCodeConfig} from '../core/config/flagshipConfig';
import {renderStatus} from '../ui/inkRenderer';
import {globalEmitter} from '../core';

/**
 * Executes the prebuild process for native code generation.
 *
 * This function orchestrates the entire prebuild workflow:
 * 1. Loads build and plugin configurations
 * 2. Sets up logging and status display
 * 3. Executes plugins in order based on their index
 * 4. Handles platform-specific (iOS/Android) and common plugin scripts
 *
 * @param {PrebuildOptions} options - Configuration options for the prebuild process
 * @param {string} options.build - The build configuration identifier to use
 * @param {string} options.env - The environment to build for
 * @param {'ios'|'android'|'native'} options.platform - Target platform(s) for code generation
 * @param {string} options.logLevel - Logging verbosity level
 * @param {boolean} options.verbose - Whether to show detailed output
 * @param {boolean} options.release - Whether to build in release mode
 *
 * @throws {Error} If plugin execution fails
 * @throws {Error} If build configuration cannot be loaded
 * @throws {Error} If flagship configuration cannot be loaded
 *
 * @emits {globalEmitter#onRun} When a plugin script completes successfully
 * @emits {globalEmitter#onError} When a plugin script fails
 * @emits {globalEmitter#onEnd} When all plugins have been processed
 *
 * @example
 * ```typescript
 * await executePrebuild({
 *   build: 'production',
 *   env: 'staging',
 *   platform: 'native',
 *   logLevel: 'info',
 *   verbose: false,
 *   release: true
 * });
 * ```
 */
export async function executePrebuild(options: PrebuildOptions) {
  const buildConfig = await findBuildConfigFiles(process.cwd(), options.build);
  const {plugins} = await loadFlagshipCodeConfig();

  const pluginCount = plugins.reduce((acc, curr) => {
    return acc + Object.keys(curr.plugin).length;
  }, 0);
  await renderStatus({
    numberOfPlugins: pluginCount,
    cmd: 'prebuild',
  });

  logger.setLogLevel(logger.getLogLevelFromString(options.logLevel));
  if (!options.verbose) {
    logger.debug(
      'Running in non-verbose mode - pausing detailed output',
      'prebuild',
    );
    logger.pause();
  }
  logger.printCmdOptions(options, 'prebuild');

  logger.info(`Found ${pluginCount} plugins to process`, 'prebuild');

  const sortedPlugins = plugins
    .map((plugin, originalIndex) => ({
      plugin,
      index:
        plugin.options?.index !== undefined
          ? plugin.options.index
          : originalIndex,
    }))
    .sort((a, b) => a.index - b.index)
    .map(({plugin}) => plugin);

  logger.info(
    `Processing ${sortedPlugins.length} plugins in order`,
    'prebuild',
  );

  for (const plugin of sortedPlugins) {
    const {name, plugin: scripts} = plugin;
    logger.info(`Processing plugin: ${name}`, 'prebuild');

    try {
      if (scripts.common) {
        logger.debug(`Running common script for plugin: ${name}`, 'prebuild');
        await scripts.common(buildConfig, options);
        globalEmitter.emit('onRun');
      }

      if (options.platform === 'ios' || options.platform === 'native') {
        if (scripts.ios) {
          logger.debug(`Running iOS script for plugin: ${name}`, 'prebuild');
          await scripts.ios(buildConfig, options);
          globalEmitter.emit('onRun');
        }
      }

      if (options.platform === 'android' || options.platform === 'native') {
        if (scripts.android) {
          logger.debug(
            `Running Android script for plugin: ${name}`,
            'prebuild',
          );
          await scripts.android(buildConfig, options);
          globalEmitter.emit('onRun');
        }
      }
    } catch (error) {
      logger.error(`Plugin execution failed: ${name}`, 'prebuild');
      globalEmitter.emit('onError');
      throw Error(`Failed to run scripts for plugin "${name}": ${error}`);
    }
  }

  logger.info('Prebuild process completed successfully', 'prebuild');
  await logger.flush();
  logger.resume();
  globalEmitter.emit('onEnd');
}
