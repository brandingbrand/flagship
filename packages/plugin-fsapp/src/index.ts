/// <reference types="@brandingbrand/code-cli-kit/types" />

/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module EnvProcessingPlugin
 */

import semver from 'semver';
import {glob} from 'glob';
import {types as t} from '@babel/core';
import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import {
  definePlugin,
  fs,
  logger,
  path,
  type BuildConfig,
  type PrebuildOptions,
  withPbxproj,
  getReactNativeVersion,
  withUTF8,
  string,
  packageToPath,
} from '@brandingbrand/code-cli-kit';
import chalk from 'chalk';
import dedent from 'dedent';
import {bundleRequire} from 'bundle-require';
import magicast from 'magicast';

/**
 * Returns the file path for the environment switcher for the specified platform.
 *
 * @param config - The build configuration object containing platform-specific settings
 * @param platform - The target platform ('ios' or 'android')
 * @returns The resolved file path to the environment switcher file
 */
export function getEnvironmentSwitcherPath(
  config: BuildConfig,
  platform: 'ios' | 'android',
) {
  const paths = {
    ios: ['ios', 'app', 'EnvSwitcher.m'],
    android: [
      'android',
      'app',
      'src',
      'main',
      'java',
      ...packageToPath(config.android.packageName),
      'EnvSwitcher.java',
    ],
  };

  return path.project.resolve(...paths[platform]);
}

/**
 * Returns the file path for the native constants for the specified platform.
 *
 * @param config - The build configuration object containing platform-specific settings
 * @param platform - The target platform ('ios' or 'android')
 * @returns The resolved file path to the native constants file
 */
export function getNativeConstantsPath(
  config: BuildConfig,
  platform: 'ios' | 'android',
) {
  const paths = {
    ios: ['ios', 'app', 'NativeConstants.m'],
    android: [
      'android',
      'app',
      'src',
      'main',
      'java',
      ...packageToPath(config.android.packageName),
      'NativeConstants.java',
    ],
  };

  return path.project.resolve(...paths[platform]);
}

/**
 * Determines if a string represents a package or a file path.
 *
 * @param {string} str - The string to check.
 * @return {boolean} True if the string represents a package, false if it represents a file path.
 */
export function isPackage(str: string): boolean {
  // Regular expression pattern to match package names
  const packagePattern =
    /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

  // Check if the string matches the package pattern
  return packagePattern.test(str);
}

/**
 * Validates environment files for proper structure and exports.
 *
 * @param {string} baseDir - The base directory to search for environment files.
 * @returns {Promise<string[]>} A promise that resolves to an array of valid environment file paths.
 * @throws {Error} If environment files don't meet the required structure.
 */
export async function validateEnvFiles(baseDir: string): Promise<string[]> {
  const pattern = path.join(baseDir, '**', 'env.*.ts');
  const files = glob.sync(pattern, {ignore: '**/node_modules/**'});

  const results: string[] = [];

  for (const file of files) {
    const code = await fs.readFile(file, 'utf-8');
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript'],
    });

    traverse(ast, {
      Program(path) {
        let hasDefaultExport = false;
        let hasDefineEnvImport = false;

        path.traverse({
          ExportNamedDeclaration(path) {
            const declaration = path.node.declaration;
            if (
              t.isTypeAlias(declaration) ||
              t.isInterfaceDeclaration(declaration) ||
              t.isTSTypeAliasDeclaration(declaration) ||
              t.isTSInterfaceDeclaration(declaration)
            ) {
              // Allows type exports
              return;
            }

            throw new Error(
              chalk.red(
                dedent`\n\nError: Named exports found in ${file}.

                Flagship Code requires that each "env.*.ts" file contain exactly one default export.
                Named exports or multiple default exports are not supported and will lead to this error.

                Steps to resolve this issue:
                1. Open the file where the error occurred.

                2. Verify that the module contains exactly one default export, structured like this:

                       export default defineEnv({
                         key: 'value',
                       });

                3. Remove any additional named exports, multiple default exports, or incorrect usage.

                For more details on "env.*.ts" file export requirements, refer to the Flagship Code documentation or contact your support team.
                `,
              ),
            );
          },
          ExportDefaultDeclaration() {
            hasDefaultExport = true;
          },
          ImportDeclaration(path) {
            if (
              path.node.source.value === '@brandingbrand/code-cli-kit' &&
              path.node.specifiers.some(
                specifier =>
                  t.isImportSpecifier(specifier) &&
                  t.isIdentifier(specifier.imported) &&
                  specifier.imported.name === 'defineEnv',
              )
            ) {
              hasDefineEnvImport = true;
            }
          },
        });

        if (!hasDefaultExport && hasDefineEnvImport) {
          throw new Error(
            chalk.red(
              dedent`\n\nError: Invalid export configuration in ${file}.

            The "env.*.ts" file must contain only a single default export in the following format:

                export default defineEnv({
                  // Your environment-specific configuration here
                });

            Issues detected:
            - Multiple default exports or no default export found.

            Steps to resolve this issue:
            1. Open the file where the error occurred: ${file}.

            2. Verify that the file contains exactly one default export, structured like this:

                   export default defineEnv({
                     key: 'value',
                   });

            3. Remove any additional default exports or invalid code that violates these constraints.

            For more details on the requirements for "env.*.ts" files, refer to the documentation or reach out for support.
            `,
            ),
          );
        }

        if (!hasDefineEnvImport) return;

        results.push(file);
      },
    });
  }

  return results;
}

/**
 * Helper function to validate and process environment files.
 * @param {boolean} isRelease - Whether the build is for a release.
 * @param {string} env - The target environment.
 * @returns {Promise<{ name: string; content: any }[]>} Processed environment contents.
 */
export async function processEnvironmentFiles(
  isRelease: boolean,
  env: string,
): Promise<{name: string; content: any}[]> {
  const envs = await validateEnvFiles(process.cwd());

  logger.log(
    `Found ${envs.length} environment configurations: ${envs.join(', ')}`,
  );

  const envContent = await Promise.all(
    envs.map(async file => {
      const match = /env\.(.*)\.ts/.exec(file);
      const content = (await bundleRequire({filepath: file, format: 'cjs'}))
        .mod;
      const name = match?.[1];

      if (!name) {
        throw Error(
          `Invalid filename format: ${file} must follow the pattern "env.<variant>.ts".`,
        );
      }

      return {name, content};
    }),
  );

  if (isRelease) {
    return envContent.filter(it => it.name === env);
  }

  return envContent;
}

/**
 * Helper function to resolve the project environment index path.
 * @param {string} version - The version of @brandingbrand/fsapp.
 * @returns {string} Resolved path to the project environment index file.
 * @throws {Error} When version cannot be parsed or is unsupported.
 */
export function resolveProjectEnvIndexPath(version: string): string {
  const coercedVersion = semver.coerce(version);

  if (!coercedVersion) {
    throw Error('Cannot parse the version of @brandingbrand/fsapp.');
  }

  if (semver.satisfies(coercedVersion, '<11')) {
    return path.resolve(
      require.resolve('@brandingbrand/fsapp/package.json', {
        paths: [process.cwd()],
      }),
      '..',
      'project_env_index.js',
    );
  }

  if (semver.satisfies(coercedVersion, '>=11')) {
    return require.resolve('@brandingbrand/fsapp/src/project_env_index.js', {
      paths: [process.cwd()],
    });
  }

  throw Error('Unsupported @brandingbrand/fsapp version.');
}

/**
 * Processes environment files and links them to the appropriate project environment index.
 * @param {PrebuildOptions & Record<string, string>} options - The prebuild options including environment settings.
 * @returns {Promise<void>} A promise that resolves when environment processing is complete.
 */
async function processAndLinkEnvs(
  options: PrebuildOptions & {env: string},
): Promise<void> {
  logger.log('Processing environment files...');

  const envContents = await processEnvironmentFiles(
    options.release,
    options.env!,
  );

  const fsappVersion = require(
    require.resolve('@brandingbrand/fsapp/package.json', {
      paths: [process.cwd()],
    }),
  ).version;

  const projectEnvIndexPath = resolveProjectEnvIndexPath(fsappVersion);

  const mod = magicast.parseModule('');

  envContents.forEach(it => {
    mod.exports[it.name] ||= {app: it.content};
  });

  magicast.writeFile(mod, projectEnvIndexPath);

  logger.log(
    `Linked environment configurations to ${projectEnvIndexPath} for iOS.`,
  );
}

export default definePlugin<unknown, {env: string}>({
  /**
   * iOS-specific logic for the plugin.
   * @param {BuildConfig & CodePluginTargetExtension} build - The build configuration for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when iOS processing is complete.
   */
  ios: async function (build, options): Promise<void> {
    logger.log('Processing environment files for iOS...');
    await processAndLinkEnvs(options);

    await withPbxproj(project => {
      const targetKey = project.findTargetKey('app');
      if (!targetKey) {
        throw Error(`[PbxprojTransformerError]: cannot find target "app" uuid`);
      }
      const opt = {target: targetKey};
      const groupKey = project.findPBXGroupKey({name: 'app'});
      if (!groupKey) {
        throw Error(`[PbxprojTransformerError]: cannot find group "app" uuid`);
      }

      project.addSourceFile('app/EnvSwitcher.m', opt, groupKey);
      project.addSourceFile('app/NativeConstants.m', opt, groupKey);
    });

    await fs.copyFile(
      path.resolve(__dirname, '..', 'assets', 'EnvSwitcher.m'),
      path.project.resolve('ios', 'app', 'EnvSwitcher.m'),
    );
    await fs.copyFile(
      path.resolve(__dirname, '..', 'assets', 'NativeConstants.m'),
      path.project.resolve('ios', 'app', 'NativeConstants.m'),
    );

    await withUTF8(getEnvironmentSwitcherPath(build, 'ios'), content => {
      return string.replace(
        content,
        /(\*initialEnvName\s+=\s+@").*(")/m,
        `$1${(options as any).env}$2`,
      );
    });

    await withUTF8(getNativeConstantsPath(build, 'ios'), content => {
      return string.replace(
        content,
        /(ShowDevMenu":\s+@").*(")/m,
        `$1${!options.release}$2`,
      );
    });
  },

  /**
   * Android-specific logic for the plugin.
   * @param {BuildConfig & CodePluginTargetExtension} build - The build configuration for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when Android processing is complete.
   */
  android: async function (
    build: BuildConfig,
    options: PrebuildOptions,
  ): Promise<void> {
    logger.log('Processing environment files for Android...');
    await processAndLinkEnvs(options as any);

    await fs.copyFile(
      path.resolve(__dirname, '..', 'assets', 'EnvSwitcher.java'),
      path.resolve(
        path.android.mainApplication(build),
        '..',
        'EnvSwitcher.java',
      ),
    );
    await fs.copyFile(
      path.resolve(__dirname, '..', 'assets', 'NativeConstants.java'),
      path.resolve(
        path.android.mainApplication(build),
        '..',
        'NativeConstants.java',
      ),
    );
    const reactNativeVersion = getReactNativeVersion();

    if (reactNativeVersion === '0.72') {
      await withUTF8(path.android.mainApplication(build), content =>
        string.replace(
          content,
          /(new PackageList.*\s+)/m,
          `$1packages.add(new NativeConstantsPackage());
             packages.add(new EnvSwitcherPackage());
             `,
        ),
      );
    }

    if (reactNativeVersion === '0.73') {
      await withUTF8(path.android.mainApplication(build), content =>
        string.replace(
          content,
          /(PackageList\(.*)\n(\s\s+)/m,
          `$1
$2add(NativeConstantsPackage())
$2add(EnvSwitcherPackage())
          `,
        ),
      );

      await withUTF8(getEnvironmentSwitcherPath(build, 'android'), content => {
        return string.replace(
          content,
          /(initialEnvName = ").*(")/m,
          `$1${(options as any).env}$2`,
        );
      });

      await withUTF8(getNativeConstantsPath(build, 'android'), content => {
        return string.replace(
          content,
          /(ShowDevMenu",\s*").*(")/m,
          `$1${!options.release}$2`,
        );
      });
    }
  },
});
