import {definePlugin, fs, logger, path} from '@brandingbrand/code-cli-kit';
import {bundleRequire} from 'bundle-require';
import semver from 'semver';

import {CodePluginEnvironment} from '../types';
import {getCodeConfig, validateEnvPaths} from '../utils';

const ENV_FILE_PATTERN = /env\.(.*)\.ts/;

/**
 * Generates the release environment file name, and validates its existence
 * @param envDir - Directory containing environment config files
 * @param env - Environment name to look for
 * @returns Release environment file name
 */
const getReleaseEnvFile = (envDir: string, env: string): string => {
  const releaseEnvName = `env.${env}.ts`;
  logger.debug(
    `Release mode specified, locating ${releaseEnvName} and ignoring all others`,
  );

  if (!fs.existsSync(path.join(envDir, releaseEnvName))) {
    logger.error(
      `Release environment file ${releaseEnvName} not found in ${envDir}`,
    );
    throw new Error(
      `Missing Configuration: Release environment file ${releaseEnvName} not found in ${envDir}. Expected pattern "env.<mode>.ts".`,
    );
  }

  logger.info(`Found release env configuration: ${releaseEnvName}`);
  return releaseEnvName;
};

/**
 * Retrieves environment configuration files from the specified directory
 * @param envDir - Directory containing environment config files
 * @param options - Options object containing release and env settings
 * @returns Array of environment file names
 * @throws {Error} If no valid environment files are found
 */
const getEnvFiles = async (envDir: string, hiddenEnvs: string[] = []) => {
  logger.debug(`Scanning for env files in directory: ${envDir}`);

  const envs = (await fs.readdir(envDir)).filter(file => {
    const [match, envName] = ENV_FILE_PATTERN.exec(file) || [];
    return Boolean(match && envName && !hiddenEnvs.includes(envName));
  });

  if (!envs.length) {
    logger.error(`No valid env files found in ${envDir}`);
    throw new Error(
      `Missing Configuration: No valid env files found in ${envDir}. Expected pattern "env.<mode>.ts".`,
    );
  }

  logger.info(`Found ${envs.length} env configurations: ${envs.join(', ')}`);
  return envs;
};

/**
 * Parses the contents of environment configuration files
 * @param envs - Array of environment file names
 * @param envDir - Directory containing the environment files
 * @returns Array of parsed environment configurations with names and content
 * @throws {Error} If environment file names don't match expected format
 */
const parseEnvContents = async (envs: string[], envDir: string) => {
  logger.debug('Beginning to parse environment file contents');
  return Promise.all(
    envs.map(async file => {
      const envName = /env\.(.*)\.ts/.exec(file)?.[1];
      if (!envName) {
        logger.error(`Invalid env file name format: ${file}`);
        throw new Error(
          `Name Mismatch: env file ${file} does not follow expected format "env.<variant>.ts".`,
        );
      }

      logger.debug(`Parsing env file: ${file}`);
      const {mod} = await bundleRequire({
        filepath: path.resolve(envDir, file),
        format: 'cjs',
      });

      return {name: envName, content: mod.default};
    }),
  );
};

/**
 * Retrieves and validates the installed FSApp version
 * @returns Coerced semver version of FSApp
 * @throws {Error} If FSApp version cannot be parsed
 */
const getFsappVersion = async () => {
  logger.debug('Retrieving FSApp version');
  const {version} = require(
    require.resolve('@brandingbrand/fsapp/package.json', {
      paths: [process.cwd()],
    }),
  );

  const coercedVersion = semver.coerce(version);
  if (!coercedVersion) {
    logger.error('Failed to parse FSApp version');
    throw new Error('Type Mismatch: cannot parse @brandingbrand/fsapp version');
  }

  logger.debug(`Found FSApp version: ${coercedVersion}`);
  return coercedVersion;
};

/**
 * Defines a plugin that manages multi-tenant environment configuration for FSApp projects
 */
export default definePlugin<CodePluginEnvironment>({
  common: async (build, options) => {
    logger.debug('Configuring FSApp runtime environments.');
    const codeConfig = await getCodeConfig();

    // Ensure required paths are valid
    await validateEnvPaths(codeConfig.envPath, options.env);

    const envs = options.release
      ? [getReleaseEnvFile(codeConfig.envPath, options.env)]
      : await getEnvFiles(
          codeConfig.envPath,
          build.codePluginEnvironment?.plugin.hiddenEnvs,
        );

    const envContents = await parseEnvContents(envs, codeConfig.envPath);
    logger.debug('Importing magicast for environment processing');
    const magicast = await import('magicast');
    const parseMod = magicast.parseModule('');
    const coercedVersion = await getFsappVersion();

    logger.debug('Determining project environment index path');
    const projectEnvIndexPath = semver.satisfies(coercedVersion, '<11')
      ? path.resolve(
          require.resolve('@brandingbrand/fsapp/package.json', {
            paths: [process.cwd()],
          }),
          '..',
          'project_env_index.js',
        )
      : require.resolve('@brandingbrand/fsapp/src/project_env_index.js', {
          paths: [process.cwd()],
        });

    if (!projectEnvIndexPath) {
      logger.error('project_env_index.js not found');
      throw new Error(
        'Missing File: cannot find project_env_index.js in @brandingbrand/fsapp to successfully link environments.',
      );
    }

    logger.debug('Processing environment contents based on FSApp version');
    if (semver.satisfies(coercedVersion, '<11')) {
      parseMod.exports.default = {};
      envContents.forEach(it => {
        parseMod.exports.default[it.name] ||= {app: it.content};
      });
    } else {
      envContents.forEach(it => {
        parseMod.exports[it.name] ||= {app: it.content};
      });
    }

    logger.debug('Writing environment configurations to file');
    magicast.writeFile(parseMod, projectEnvIndexPath);

    logger.info(
      `Successfully linked ${envContents.map(it => it.name).join(', ')} to @brandingbrand/fsapp project_env_index.js`,
    );
  },
});
