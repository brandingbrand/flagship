import semver from 'semver';
import type {PackageJson} from 'type-fest';
import {fs, logger, path, definePlugin} from '@brandingbrand/code-cli-kit';
import {bundleRequire} from 'bundle-require';

/**
 * Defines a plugin that manages multi-tenant environment configuration for FSApp projects
 */
export default definePlugin({
  /**
   * Common execution function that handles environment configuration linking
   * @param _ - Unused first parameter
   * @param options - Configuration options including release and environment settings
   */
  common: async (_, options) => {
    /**
     * Validates that the package.json contains required FSApp dependencies.
     * This function checks that the package.json has a dependencies section
     * and includes the @brandingbrand/fsapp dependency.
     *
     * @param pkg - The parsed package.json contents
     * @returns {boolean} False if validation fails, undefined if successful
     * @throws {Error} If dependencies are missing or FSApp dependency is not found
     */
    const validatePackageJson = (pkg: PackageJson): boolean => {
      logger.debug('Validating package.json dependencies...');
      if (!pkg.dependencies) {
        logger.error('No dependencies found in package.json');
        return false;
      }

      if (!('@brandingbrand/fsapp' in pkg.dependencies)) {
        logger.error('Missing @brandingbrand/fsapp dependency');
        return false;
      }
      logger.debug('Package.json validation successful');

      return true;
    };

    /**
     * Retrieves environment configuration files from the specified directory
     * @param envDir - Directory containing environment config files
     * @param options - Options object containing release and env settings
     * @returns Array of environment file names
     * @throws {Error} If no valid environment files are found
     */
    const getEnvFiles = async (envDir: string, options: any) => {
      logger.debug(`Scanning for env files in directory: ${envDir}`);
      const envs = (await fs.readdir(envDir)).filter(file =>
        options.release
          ? path.basename(file) === `env.${options.env}.ts`
          : /env\..*\.ts/.test(file),
      );

      if (!envs.length) {
        logger.error(`No valid env files found in ${envDir}`);
        throw new Error(
          `Missing Configuration: No valid env files found in ${envDir}. Expected pattern "env.<mode>.ts".`,
        );
      }

      logger.debug(`Found ${envs.length} environment files`);
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
        throw new Error(
          'Type Mismatch: cannot parse @brandingbrand/fsapp version',
        );
      }

      logger.debug(`Found FSApp version: ${coercedVersion}`);
      return coercedVersion;
    };

    // Main execution flow
    logger.info('Starting environment configuration process');
    const pkg = require(path.project.resolve('package.json')) as PackageJson;
    const valid = validatePackageJson(pkg);

    if (!valid) {
      return;
    }

    logger.debug('Loading flagship-code configuration');
    const {mod} = await bundleRequire({
      filepath: path.project.resolve('flagship-code.config.ts'),
      format: 'cjs',
    });

    const envDir = path.project.resolve(mod.default.envPath);
    if (!(await fs.doesPathExist(envDir))) {
      logger.error(`Environment directory not found: ${envDir}`);
      throw new Error(
        `Unknown Path: env directory: ${envDir} does not exist. Check the "envPath" attribute in flagship-code.config.ts.`,
      );
    }

    const envs = await getEnvFiles(envDir, options);
    logger.info(`Found ${envs.length} env configurations: ${envs.join(', ')}`);

    const envContents = await parseEnvContents(envs, envDir);
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
