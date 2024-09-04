import semver from 'semver';
import type {PackageJson} from 'type-fest';
import {fs, logger, path} from '@brandingbrand/code-cli-kit';

import {bundleRequire, config, defineAction} from '@/lib';

/**
 * Define an action to process environment files.
 * @remarks
 * This action reads environment files from a specified directory, validates their names and formats, and then processes them accordingly.
 * @returns {Promise<string>} - Promise that resolves a string when the action completes successfully.
 * @throws {Error} - Throws an error if the environment directory doesn't exist or if it doesn't contain any valid environment files.
 */
export default defineAction(async () => {
  // Resolve the path to the project's package.json file
  const pkg = require(path.project.resolve('package.json')) as PackageJson;

  // Throw warning if no dependencies object
  if (!pkg.dependencies) {
    throw Error(
      'Missing Configuration: Unable to locate dependencies object in package.json. Please note that the absence of the @brandingbrand/fsapp dependency will prevent you from leveraging the benefits of multi-tenant typed environments.',
    );
  }

  // Check if the package.json file contains dependencies
  // Find the index of the '@brandingbrand/fsapp' dependency in the dependencies object
  const index = Object.keys(pkg.dependencies).findIndex(
    it => it === '@brandingbrand/fsapp',
  );

  // If the dependency is not found, throw a warning
  if (index === -1) {
    throw Error(
      "Missing Configuration: Unable to locate the '@brandingbrand/fsapp' dependency. Please note that the absence of this dependency will prevent you from leveraging the benefits of multi-tenant typed environments.",
    );
  }

  // Resolve the environment directory path based on the configuration
  const envDir = path.project.resolve(config.code.envPath);

  // Check if the environment directory exists
  if (!(await fs.doesPathExist(envDir))) {
    throw Error(
      `Unknown Path: env directory: ${envDir}, does not exist. Please check the "envPath" attribute in flagship-code.config.ts.`,
    );
  }

  // Read the contents of the environment directory and filter out files matching the expected pattern
  const envs = (await fs.readdir(envDir)).filter(it => {
    if (config.options.release) {
      return path.basename(it) === `env.${config.options.env}.ts`;
    }

    return /env\..*\.ts/.test(it);
  });

  // Throw an error if no valid environment files are found in the directory
  if (!envs.length) {
    throw Error(
      `Missing Configuration: env directory: ${envDir}, does not contain any env files that match the pattern "env.<mode>.ts". Please move your env files to ${envDir}.`,
    );
  }

  logger.log(`found ${envs.length} env configurations: ${envs.join(', ')}`);

  // Read the contents of each environment file and validate its name and format
  const envContents = await Promise.all(
    envs.map(async it => {
      const envRegExpExecArray = /env\.(.*)\.ts/.exec(it);
      const content = (await bundleRequire(path.resolve(envDir, it))).default;

      const name = envRegExpExecArray?.pop();

      // Throw an error if the environment file doesn't follow the expected format
      if (!name) {
        throw Error(
          `Name Mismatch: env file ${it} does not follow expected format "env.<variant>.ts".`,
        );
      }

      return {
        name,
        content,
      };
    }),
  );

  // Import the 'magicast' module due to esm type
  const magicast = await import('magicast');

  // Parse a module with an empty default export
  const mod = magicast.parseModule('');

  // Get the version of the @brandingbrand/fsapp
  // Use require.resolve to support monorepos with the paths set to current working directory
  const {version} = require(
    require.resolve('@brandingbrand/fsapp/package.json', {
      paths: [process.cwd()],
    }),
  );

  // Coerce the version to a comparable semver version i.e. 12.0.0-alpha.1 -> 12.0.0
  const coercedVersion = semver.coerce(version);

  // If semver cannot parse the version then we cannot compare versions to be able to
  // determine where project_env_index.js is located - throw error to user
  if (!coercedVersion) {
    throw Error('Type Mismatch: cannot parse @brandingbrand/fsapp version');
  }

  // Resolve the path of the project environment index file from @brandingbrand/fsapp
  // There is a chance this could throw an error, this is fine, still even though we checked the dependencies object already
  let projectEnvIndexPath;

  if (semver.satisfies(coercedVersion, '<11')) {
    // project_env_index.js doesn't exist in @brandingbrand/fsapp <v11 - it is assumed to be written to the root
    // directory of the package. We can get the path based on the package.json and resolve to parent directory with
    // the project_env_index.js identifier.
    projectEnvIndexPath = path.resolve(
      require.resolve('@brandingbrand/fsapp/package.json', {
        paths: [process.cwd()],
      }),
      '..',
      'project_env_index.js',
    );

    mod.exports.default = {};

    // Add each environment's content to the module's default export
    // In fsapp <v11 the export is expected to be a default export
    // https://github.com/brandingbrand/flagship/blob/7b540442d2b83ad710e98981bd368039f0eb635c/packages/fsapp/src/index.ts#L6
    envContents.forEach(it => {
      mod.exports.default[it.name] ||= {app: it.content};
    });
  }

  if (semver.satisfies(coercedVersion, '>10')) {
    projectEnvIndexPath = require.resolve(
      '@brandingbrand/fsapp/src/project_env_index.js',
      {paths: [process.cwd()]},
    );

    // Add each environment's content to the module's named exports
    // In fsapp v11+ the exports are expected to be named exports
    // https://github.com/brandingbrand/shipyard/blob/d76c38edb8e6794bd0d412520e9295238fdef22f/libs/fsapp/src/beta-app/env.ts#L7
    envContents.forEach(it => {
      mod.exports[it.name] ||= {app: it.content};
    });
  }

  if (!projectEnvIndexPath) {
    throw Error(
      'Missing File: cannot find project_env_index.js in @brandingbrand/fsapp to successfully link environments.',
    );
  }

  // Write the module to the project environment index file
  magicast.writeFile(mod, projectEnvIndexPath);

  logger.log(
    `linked ${envContents.map(it => it.name).join(', ')} to @brandingbrand/fsapp project_env_index.js`,
  );
});
