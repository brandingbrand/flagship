import {CodeConfig, path} from '@brandingbrand/code-cli-kit';
import {findConfigFile} from 'typescript';

import {bundleRequire} from '@/utils/bundleRequire';

/**
 * Represents a plugin with its configuration options
 */
interface Plugin {
  name: string;
  plugin: any;
  options?: {
    index?: number;
  };
}

/**
 * Represents a preset that contains multiple plugins
 */
interface Preset {
  name: string;
  plugins: Plugin[];
}

/**
 * Represents the complete loaded configuration with plugins and presets
 */
interface LoadedConfig {
  preset?: Preset;
  plugins: Plugin[];
  config: CodeConfig;
}

/**
 * Resolves a module path using Node's require.resolve
 *
 * @param {string} id - The module identifier to resolve
 * @param {string} cwd - The current working directory
 * @returns {Promise<string>} The resolved module path
 * @throws {Error} If the module cannot be resolved
 */
async function resolveModule(id: string, cwd: string): Promise<string> {
  try {
    return require.resolve(id, {paths: [cwd]});
  } catch {
    return require.resolve(path.join(cwd, id));
  }
}

/**
 * Loads a plugin from a configuration
 *
 * @param {string | [string, {index?: number}]} pluginConfig - The plugin configuration
 * @param {string} cwd - The current working directory
 * @returns {Promise<Plugin>} The loaded plugin
 * @throws {Error} If the plugin cannot be loaded
 */
async function loadPlugin(
  pluginConfig: string | [string, {index?: number}],
  cwd: string,
): Promise<Plugin> {
  const [pluginName, pluginOptions] = Array.isArray(pluginConfig)
    ? pluginConfig
    : [pluginConfig, undefined];

  try {
    const pluginPath = await resolveModule(pluginName, cwd);
    const plugin = await bundleRequire(pluginPath);

    return {
      name: pluginName,
      plugin,
      options: pluginOptions,
    };
  } catch (error) {
    throw new Error(`Failed to load plugin "${pluginName}": ${error}`);
  }
}

/**
 * Loads a preset and its plugins
 *
 * @param {string} presetName - The name of the preset to load
 * @param {string} cwd - The current working directory
 * @returns {Promise<Preset>} The loaded preset with its plugins
 * @throws {Error} If the preset cannot be loaded or is invalid
 */
async function loadPreset(presetName: string, cwd: string): Promise<Preset> {
  try {
    const presetPath = await resolveModule(presetName, cwd);
    const presetModule = await bundleRequire<Preset>(presetPath);

    if (!Array.isArray(presetModule)) {
      throw new Error(`Preset "${presetName}" must export a plugins array`);
    }

    const plugins = await Promise.all(
      presetModule.map((plugin: any) => loadPlugin(plugin, cwd)),
    );

    return {
      name: presetName,
      plugins,
    };
  } catch (error) {
    throw new Error(`Failed to load preset "${presetName}": ${error}`);
  }
}

/**
 * Loads and validates the flagship code configuration file, including its presets and plugins
 *
 * This function searches for a 'flagship-code.config.ts' file starting from the specified
 * root directory and moving up through parent directories. Once found, it bundles and
 * loads the configuration file, its preset (if any), and plugins.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.rootDir - The directory to start searching for the config file (defaults to current working directory)
 * @param {boolean} options.debug - Enable debug logging
 * @returns {Promise<LoadedConfig>} A promise that resolves to the loaded and validated configuration with plugins
 * @throws {Error} If the config file is not found, cannot be loaded, or is invalid
 *
 * @example
 * ```typescript
 * try {
 *   const { config, plugins } = await loadFlagshipCodeConfig({ debug: true });
 *   // Use the loaded configuration and plugins
 * } catch (error) {
 *   console.error('Failed to load config:', error);
 * }
 * ```
 */
export async function loadFlagshipCodeConfig({
  rootDir = process.cwd(),
  debug = false,
}: {
  rootDir?: string;
  debug?: boolean;
} = {}): Promise<LoadedConfig> {
  try {
    // Look for config file in current directory and parent directories
    const configPath = findConfigFile(
      rootDir,
      path.isAbsolute,
      'flagship-code.config.ts',
    );

    if (!configPath) {
      throw new Error(
        'Could not find flagship-code.config.ts in current directory or any parent directory',
      );
    }

    if (debug) {
      console.log(`Loading config from: ${configPath}`);
    }

    const config = await bundleRequire<CodeConfig>(configPath);

    if (!config || typeof config !== 'object' || config === null) {
      throw new Error(`Invalid configuration format in ${configPath}`);
    }

    // Initialize result
    const result: LoadedConfig = {
      plugins: [],
      config,
    };

    // Load preset if it exists
    if (config.preset) {
      if (debug) {
        console.log('Loading preset:', config.preset);
      }
      result.preset = await loadPreset(config.preset, rootDir);
      result.plugins.push(...result.preset.plugins);
    }

    // Load additional plugins
    if (config.plugins) {
      if (debug) {
        console.log('Loading plugins:', config.plugins);
      }
      const loadedPlugins = await Promise.all(
        config.plugins.map(plugin => loadPlugin(plugin, rootDir)),
      );
      result.plugins.push(...loadedPlugins);
    }

    if (debug) {
      console.log('Loaded configuration:', {
        preset: result.preset?.name,
        plugins: result.plugins.map(p => ({
          name: p.name,
          options: p.options,
        })),
      });
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load flagship config: ${error.message}`);
    }
    throw error;
  }
}
