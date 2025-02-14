import semver from 'semver';
import type {PackageJson} from 'type-fest';
import {fs, logger, path, definePlugin} from '@brandingbrand/code-cli-kit';
import {bundleRequire} from 'bundle-require';

export default definePlugin({
  common: async (build, options) => {
    // Resolve the path to the project's package.json file
    const pkg = require(path.project.resolve('package.json')) as PackageJson;

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

    const envs = (await fs.readdir(envDir)).filter(it => {
      return options.release
        ? path.basename(it) === `env.${options.env}.ts`
        : /env\..*\.ts/.test(it);
    });

    if (!envs.length) {
      throw new Error(
        `Missing Configuration: No valid env files found in ${envDir}. Expected pattern "env.<mode>.ts".`,
      );
    }

    logger.log(`Found ${envs.length} env configurations: ${envs.join(', ')}`);

    const envContents = await Promise.all(
      envs.map(async it => {
        const envRegExpExecArray = /env\.(.*)\.ts/.exec(it);
        const content = (
          await bundleRequire({
            filepath: path.resolve(envDir, it),
            format: 'cjs',
          })
        ).mod.default;
        const name = envRegExpExecArray?.pop();

        if (!name) {
          throw new Error(
            `Name Mismatch: env file ${it} does not follow expected format "env.<variant>.ts".`,
          );
        }

        return {name, content};
      }),
    );

    const magicast = await import('magicast');
    const parseMod = magicast.parseModule('');

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

    let projectEnvIndexPath;

    if (semver.satisfies(coercedVersion, '<11')) {
      projectEnvIndexPath = path.resolve(
        require.resolve('@brandingbrand/fsapp/package.json', {
          paths: [process.cwd()],
        }),
        '..',
        'project_env_index.js',
      );

      parseMod.exports.default = {};
      envContents.forEach(it => {
        parseMod.exports.default[it.name] ||= {app: it.content};
      });
    } else {
      projectEnvIndexPath = require.resolve(
        '@brandingbrand/fsapp/src/project_env_index.js',
        {
          paths: [process.cwd()],
        },
      );

      envContents.forEach(it => {
        parseMod.exports[it.name] ||= {app: it.content};
      });
    }

    if (!projectEnvIndexPath) {
      throw new Error(
        'Missing File: cannot find project_env_index.js in @brandingbrand/fsapp to successfully link environments.',
      );
    }

    magicast.writeFile(parseMod, projectEnvIndexPath);

    logger.log(
      `Linked ${envContents.map(it => it.name).join(', ')} to @brandingbrand/fsapp project_env_index.js`,
    );
  },
});
