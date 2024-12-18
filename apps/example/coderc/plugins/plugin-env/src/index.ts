import {
  definePlugin,
  fs,
  path,
  withInfoPlist,
  withStrings,
} from '@brandingbrand/code-cli-kit';

/**
 * Custom error for missing required options.
 */
class MissingOptionError extends Error {
  constructor(optionName: string) {
    super(`MissingOptionError: missing ${optionName} variable`);
    this.name = 'MissingOptionError';
  }
}

/**
 * Custom error for when a specified directory does not exist.
 */
class DirectoryNotFoundError extends Error {
  constructor(directoryPath: string) {
    super(
      `DirectoryNotFoundError: The directory "${directoryPath}" does not exist.`,
    );
    this.name = 'DirectoryNotFoundError';
  }
}

/**
 * Custom error for when a specified file does not exist.
 */
class FileNotFoundError extends Error {
  constructor(filePath: string) {
    super(`FileNotFoundError: The file "${filePath}" does not exist.`);
    this.name = 'FileNotFoundError';
  }
}

/**
 * Type definition for the plugin options.
 */
interface PluginOptions {
  appEnvInitial: string;
  appEnvDir: string;
  appEnvHide?: string[];
  release: boolean;
}

/**
 * Helper function to validate required options.
 */
async function validateOptions(options: PluginOptions) {
  if (!options.appEnvInitial) {
    throw new MissingOptionError('appEnvInitial');
  }
  if (!options.appEnvDir) {
    throw new MissingOptionError('appEnvDir');
  }

  const absoluteAppEnvDir = path.resolve(process.cwd(), options.appEnvDir);
  if (!(await fs.doesPathExist(absoluteAppEnvDir))) {
    throw new DirectoryNotFoundError(absoluteAppEnvDir);
  }

  const absoluteInitialAppEnvPath = path.resolve(
    process.cwd(),
    options.appEnvDir,
    `env.${options.appEnvInitial}.ts`,
  );
  if (!(await fs.doesPathExist(absoluteInitialAppEnvPath))) {
    throw new FileNotFoundError(absoluteInitialAppEnvPath);
  }
}

/**
 * Helper function to write the environment configuration file.
 */
async function writeEnvConfig(options: PluginOptions) {
  const configPath = path.join(process.cwd(), '.flagshipappenvrc');
  const configData = {
    hiddenEnvs: options.appEnvHide || [],
    singleEnv: options.release,
    dir: options.appEnvDir,
  };

  await fs.writeFile(configPath, JSON.stringify(configData, null, 2) + '\n');
}

/**
 * Defines a plugin for both iOS and Android platforms.
 */
export default definePlugin({
  ios: async (_build: object, options: any): Promise<void> => {
    await validateOptions(options);

    await withInfoPlist(plist => ({
      ...plist,
      FlagshipEnv: options.appEnvInitial,
      FlagshipDevMenu: options.release,
    }));

    await writeEnvConfig(options);
  },

  android: async (_build: object, options: any): Promise<void> => {
    await validateOptions(options);

    await withStrings(xml => {
      xml.resources.string?.push(
        {$: {name: 'flagship_env'}, _: options.appEnvInitial},
        {$: {name: 'flagship_dev_menu'}, _: `${options.release}`},
      );
      return xml;
    });

    await writeEnvConfig(options);
  },
});
