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
function validateOptions(options: PluginOptions) {
  if (!options.appEnvInitial) {
    throw new MissingOptionError('appEnvInitial');
  }
  if (!options.appEnvDir) {
    throw new MissingOptionError('appEnvDir');
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
    validateOptions(options);

    await withInfoPlist(plist => ({
      ...plist,
      FlagshipEnv: options.appEnvInitial,
      FlagshipDevMenu: options.release,
    }));

    await writeEnvConfig(options);
  },

  android: async (_build: object, options: any): Promise<void> => {
    validateOptions(options);

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
