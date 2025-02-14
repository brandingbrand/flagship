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
     * Validates that the package.json contains required FSApp dependencies
     * @param pkg - The parsed package.json contents
     * @throws {Error} If dependencies are missing or FSApp dependency is not found
     */
    const validatePackageJson = (pkg: PackageJson) => {
      if (!pkg.dependencies) {
        throw new Error(
          'Missing Configuration: Unable to locate dependencies object in package.json. The absence of @brandingbrand/fsapp will prevent multi-tenant typed environments.',
        );
      }

      if (!('@brandingbrand/fsapp' in pkg.dependencies)) {
        throw new Error(
          "Missing Configuration: Unable to locate the '@brandingbrand/fsapp' dependency. Multi-tenant typed environments will not work without this.",
        );
      }
    };

    /**
     * Retrieves environment configuration files from the specified directory
     * @param envDir - Directory containing environment config files
     * @param options - Options object containing release and env settings
     * @returns Array of environment file names
     * @throws {Error} If no valid environment files are found
     */
    const getEnvFiles = async (envDir: string, options: any) => {
      const envs = (await fs.readdir(envDir)).filter(file =>
        options.release
          ? path.basename(file) === `env.${options.env}.ts`
          : /env\..*\.ts/.test(file),
      );

      if (!envs.length) {
        throw new Error(
          `Missing Configuration: No valid env files found in ${envDir}. Expected pattern "env.<mode>.ts".`,
        );
      }

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
      return Promise.all(
        envs.map(async file => {
          const envName = /env\.(.*)\.ts/.exec(file)?.[1];
          if (!envName) {
            throw new Error(
              `Name Mismatch: env file ${file} does not follow expected format "env.<variant>.ts".`,
            );
          }

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
      const {version} = require(
        require.resolve('@brandingbrand/fsapp/package.json', {
          paths: [process.cwd()],
        }),
      );

      const coercedVersion = semver.coerce(version);
      if (!coercedVersion) {
        throw new Error(
          'Type Mismatch: cannot parse @brandingbrand/fsapp version',
        );
      }

      return coercedVersion;
    };

    // Main execution flow
    const pkg = require(path.project.resolve('package.json')) as PackageJson;
    validatePackageJson(pkg);

    const {mod} = await bundleRequire({
      filepath: 'flagship-code.config.ts',
      cwd: process.cwd(),
      format: 'cjs',
    });

    const envDir = path.project.resolve(mod.default.envPath);
    if (!(await fs.doesPathExist(envDir))) {
      throw new Error(
        `Unknown Path: env directory: ${envDir} does not exist. Check the "envPath" attribute in flagship-code.config.ts.`,
      );
    }

    const envs = await getEnvFiles(envDir, options);
    logger.log(`Found ${envs.length} env configurations: ${envs.join(', ')}`);

    const envContents = await parseEnvContents(envs, envDir);
    const magicast = await import('magicast');
    const parseMod = magicast.parseModule('');
    const coercedVersion = await getFsappVersion();

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
      throw new Error(
        'Missing File: cannot find project_env_index.js in @brandingbrand/fsapp to successfully link environments.',
      );
    }

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

    magicast.writeFile(parseMod, projectEnvIndexPath);

    logger.log(
      `Linked ${envContents.map(it => it.name).join(', ')} to @brandingbrand/fsapp project_env_index.js`,
    );
  },
});
