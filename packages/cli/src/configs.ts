import * as fs from 'fs';
import path from 'path';

import * as t from '@babel/types'; // Import babel types
import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import {glob} from 'glob';
import {findConfigFile} from 'typescript';
import {BuildConfig, CodeConfig} from '@brandingbrand/code-cli-kit';

import {bundleRequire} from './lib';

/**
 * Finds and validates build configuration files in the specified directory
 *
 * @async
 * @param {string} rootDir - The root directory to search for build files
 * @param {string} build - The specific build configuration to find
 * @returns {Promise<BuildFile[]>} Array of valid build configuration files
 * @throws {Error} If no valid build file is found or if there are parsing errors
 */
export async function findBuildConfigFiles(
  rootDir: string,
  build: string,
): Promise<BuildConfig> {
  /**
   * Checks if a file contains the defineBuild import from code-cli-kit
   *
   * @param {string} fileContent - The content of the file to check
   * @returns {{ hasDefineBuild: boolean; importLine?: number }} Object indicating if and where defineBuild is imported
   */
  const checkForDefineBuildImport = (
    fileContent: string,
  ): {hasDefineBuild: boolean; importLine?: number} => {
    let hasDefineBuild = false;
    let importLine: number | undefined;

    try {
      const ast = parse(fileContent, {
        sourceType: 'module',
        plugins: ['typescript'],
      });

      traverse(ast, {
        ImportDeclaration(path) {
          const node = path.node;

          // Check if import is from @brandingbrand/code-cli-kit
          if (node.source.value === '@brandingbrand/code-cli-kit') {
            node.specifiers.forEach(specifier => {
              // Use t.isImportSpecifier for type checking
              if (
                t.isImportSpecifier(specifier) &&
                t.isIdentifier(specifier.imported) &&
                specifier.imported.name === 'defineBuild'
              ) {
                hasDefineBuild = true;
                importLine = node.loc?.start.line;
              }
            });
          }
        },
      });
    } catch (error) {
      console.error(`Error parsing file: ${error}`);
      return {hasDefineBuild: false};
    }

    return {hasDefineBuild, importLine};
  };

  const pattern = path.join(rootDir, '**/build.*.ts');
  try {
    const files = await glob(pattern, {ignore: ['**/node_modules/**']});

    const buildFile = files.find(filePath => {
      const fileName = path.basename(filePath);
      const buildConfig = fileName.replace(/^build\.(.+)\.ts$/, '$1');

      if (buildConfig !== build) return false;

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const {hasDefineBuild, importLine} =
        checkForDefineBuildImport(fileContent);

      return hasDefineBuild && importLine;
    });

    if (!buildFile) {
      throw Error(build);
    }

    const buildConfig = await bundleRequire<BuildConfig>(buildFile);

    return buildConfig;
  } catch (error) {
    throw new Error(`Failed to find build config files: ${error}`);
  }
}

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
