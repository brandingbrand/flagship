import {AlignDepsOptions, logger} from '@brandingbrand/code-cli-kit';

import {loadPlugin} from '../core/config/flagshipConfig';
import {globalEmitter} from '../core';

import {renderStatus} from '@/ui/inkRenderer';

/**
 * Executes the align-deps process to verify and optionally fix dependency versions.
 *
 * This function runs the verify-dependencies plugin to:
 * 1. Check project dependencies against React Native version profiles
 * 2. Identify version mismatches and compatibility issues
 * 3. Optionally update package.json with correct versions
 *
 * @param {AlignDepsOptions} options - Configuration options for dependency alignment
 * @param {string} options.build - The build configuration identifier to use
 * @param {string} options.env - The environment context
 * @param {string} options.logLevel - Logging verbosity level
 * @param {boolean} options.verbose - Whether to show detailed output
 * @param {boolean} options.fix - Whether to automatically fix dependency issues
 *
 * @throws {Error} If plugin execution fails
 * @throws {Error} If build configuration cannot be loaded
 * @throws {Error} If flagship configuration cannot be loaded
 *
 * @emits {globalEmitter#onRun} When plugin execution completes successfully
 * @emits {globalEmitter#onError} When plugin execution fails
 * @emits {globalEmitter#onEnd} When process completes
 *
 * @example
 * ```typescript
 * await executeAlignDeps({
 *   build: 'development',
 *   env: 'local',
 *   logLevel: 'info',
 *   verbose: true,
 *   fix: false
 * });
 * ```
 */
export async function executeAlignDeps(options: AlignDepsOptions) {
  const verifyDepsPlugin = await loadPlugin(
    '@brandingbrand/code-plugin-verify-dependencies',
    process.cwd(),
  );

  if (!verifyDepsPlugin) {
    throw new Error('Verify dependencies plugin not found');
  }

  await renderStatus({
    numberOfPlugins: 1,
    cmd: 'align-deps',
  });

  logger.pause();
  await logger.printCmdOptions(options, 'align-deps');

  try {
    logger.info('Running dependency verification...', 'align-deps');

    if (verifyDepsPlugin.plugin.common) {
      await verifyDepsPlugin.plugin.common({}, options);
      globalEmitter.emit('onRun');
    }

    logger.info(
      `Dependency verification completed ${options.fix ? 'and fixed' : ''}`,
      'align-deps',
    );
  } catch (error) {
    logger.error('Failed to verify dependencies', 'align-deps');
    globalEmitter.emit('onError');
    throw error;
  } finally {
    await logger.flush();
    logger.resume();
    globalEmitter.emit('onEnd');
  }
}
