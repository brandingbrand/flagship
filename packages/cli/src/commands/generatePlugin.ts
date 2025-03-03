import {GenerateOptions, logger} from '@brandingbrand/code-cli-kit';

import {
  loadFlagshipCodeConfig,
  loadPlugin,
} from '../core/config/flagshipConfig';
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
 */
export async function generatePlugin(str: string, options: GenerateOptions) {
  let hasError = false;
  const {config} = await loadFlagshipCodeConfig();

  const pluginGeneratePlugin = await loadPlugin(
    '@brandingbrand/code-plugin-generate-plugin',
    process.cwd(),
  );

  if (!pluginGeneratePlugin) {
    throw new Error('Generate Plugin plugin not found');
  }

  await renderStatus({
    numberOfPlugins: 1,
    cmd: 'align-deps',
  });

  logger.pause();
  await logger.printCmdOptions(options, 'generate-plugin');

  try {
    logger.info('Generating a plugin...', 'generate-plugin');

    if (pluginGeneratePlugin.plugin.common) {
      await pluginGeneratePlugin.plugin.common(
        {},
        {
          pluginName: str,
          pluginPath: config.pluginPath,
        },
      );
      globalEmitter.emit('onRun');
    }
  } catch (error) {
    logger.error('Failed to verify dependencies', 'generate-plugin');
    globalEmitter.emit('onError');
    hasError = true;
  } finally {
    await logger.flush();
    if (hasError) return;

    logger.resume();
    globalEmitter.emit('onEnd');
  }
}
