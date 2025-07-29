import {
  BuildConfig,
  CodeConfig,
  PrebuildOptions,
  fs,
  logger,
  path,
  withInfoPlist,
  withStrings,
} from '@brandingbrand/code-cli-kit';

import {CodePluginEnvironment} from '../types';
import {definePackagePlugin, getCodeConfig, validateEnvPaths} from '../utils';

/**
 * Helper function to write the environment configuration file.
 */
async function writeEnvConfig(
  build: BuildConfig & CodePluginEnvironment,
  options: PrebuildOptions,
  config: CodeConfig,
) {
  const configPath = path.join(process.cwd(), '.flagshipappenvrc');
  const configData = {
    hiddenEnvs: build.codePluginEnvironment?.plugin.hiddenEnvs || [],
    singleEnv: options.release,
    dir: config.envPath,
  };

  await fs.writeFile(configPath, JSON.stringify(configData, null, 2) + '\n');
  logger.debug(`App environment configuration written to ${configPath}`);
}

/**
 * Defines a plugin for both iOS and Android platforms.
 */
export default definePackagePlugin({
  package: '@brandingbrand/code-app-env',
  common: async (build, options) => {
    logger.debug('Linking runtime environments to Flagship™ Code App ENV.');
    const codeConfig = await getCodeConfig();
    await validateEnvPaths(codeConfig.envPath, options.env);
    await writeEnvConfig(build, options, codeConfig);
  },
  ios: async (_, options): Promise<void> => {
    logger.debug('Configuring iOS environment settings.');
    await withInfoPlist(plist => ({
      ...plist,
      FlagshipEnv: options.env,
      FlagshipDevMenu: !options.release,
    }));
  },
  android: async (_, options): Promise<void> => {
    logger.debug('Configuring Android environment settings.');
    await withStrings(xml => {
      xml.resources.string?.push(
        {$: {name: 'flagship_env'}, _: options.env},
        {$: {name: 'flagship_dev_menu'}, _: `${!options.release}`},
      );
      return xml;
    });
  },
});
