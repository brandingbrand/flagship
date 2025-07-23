import fs from 'fs-extra';
import {
  fs as flagshipFs,
  path,
  definePlugin,
  BuildConfig,
  PrebuildOptions,
  version as flagshipVersion,
  globAndReplace,
  logger,
} from '@brandingbrand/code-cli-kit';
import type {PackageJson} from 'type-fest';
import semver from 'semver';

import {transformers} from './transformers';
import {transforms} from './transforms';

/** Type representing the available template types for core native files */
type RNTemplateType = 'react-native' | 'supporting-files';
/** Type representing all template types available */
type TemplateType = RNTemplateType | 'dependency-files';

/**
 * finds and loads the main project package.json file
 */
const getProjectPackageJson = (): PackageJson => {
  const pkg = require(path.project.resolve('package.json')) as PackageJson;
  if (!pkg) {
    throw new Error(
      'Unable to parse project package.json. Ensure it exists and is valid.',
    );
  }
  return pkg;
};

/**
 * Resolves the path to a template file or directory based on type and additional path parts specified.
 *
 * @param templateType - The type of template to locate
 * @param pathParts - Additional path parts
 * @returns The fully resolved path to the specified template file or directory
 */
const resolveTemplatePath = (
  templateType: TemplateType,
  ...pathParts: string[]
) =>
  path.join(
    require.resolve('@brandingbrand/code-templates/package.json'),
    '..',
    templateType,
    ...pathParts,
  );

/**
 * Gets the filesystem path to a template based on type, platform and version
 * @param templateType - The type of template to locate
 * @param platform - The target platform (iOS or Android)
 * @param version - The version string to match
 * @returns The full filesystem path to the template
 */
const getRNTemplatePath = (
  templateType: RNTemplateType,
  platform: 'ios' | 'android',
  version: string,
): string => {
  logger.debug(
    `Getting template path for ${templateType} ${platform} v${version}`,
  );

  const coercedVersion = semver.coerce(version);
  if (!coercedVersion) {
    throw new Error(`Invalid version string: ${version}`);
  }

  // Try each possible minor version down to 0
  for (
    let minorVersion = semver.minor(coercedVersion);
    minorVersion >= 0;
    minorVersion--
  ) {
    const tryVersion = `${semver.major(coercedVersion)}.${minorVersion}`;
    const tryPath = resolveTemplatePath(templateType, tryVersion, platform);

    if (fs.existsSync(tryPath)) {
      return tryPath;
    }
  }

  throw new Error(
    `Template not found for ${templateType} ${platform} v${version}`,
  );
};

/**
 * Verifies that a file is ready for transformation by checking it exists
 * and has the expected content length
 * @param filePath - Path to the file to verify
 */
const verifyFileReady = async (filePath: string): Promise<void> => {
  // Wait for file to be accessible
  let retries = 5;
  let fileReady = false;

  while (retries > 0 && !fileReady) {
    try {
      const stats = await fs.stat(filePath);
      if (stats.size > 0) {
        fileReady = true;
      } else {
        // If file exists but is empty, wait a bit
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      logger.debug(`File not ready yet: ${filePath}, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    retries--;
  }

  if (!fileReady) {
    logger.warn(`File may not be ready for transformation: ${filePath}`);
  }
};

/**
 * Applies appropriate transformations to a file based on matching rules
 * @param destEntry - Path to the file to transform
 * @param config - Build configuration object
 * @param options - Prebuild options
 */
const applyTransform = async (
  destEntry: string,
  config: BuildConfig,
  options: PrebuildOptions,
): Promise<void> => {
  logger.debug(`Applying transforms to ${destEntry}`);
  const transformerEntry = transformers.find(t => t.test.test(destEntry));
  const transformsEntry = Object.values(transforms).find(predicate =>
    predicate.__test.test(destEntry),
  );

  if (transformerEntry && transformsEntry) {
    logger.debug(`Found matching transformer for ${destEntry}`);
    const {__test, ...passTransforms} = transformsEntry;
    await transformerEntry.use(config, options, passTransforms, destEntry);
  }
};

/**
 * Recursively walks through a directory, copying and transforming files
 * @param srcDir - Source directory path
 * @param destDir - Destination directory path
 * @param config - Build configuration object
 * @param options - Prebuild options
 */
const walkAndTransform = async (
  srcDir: string,
  destDir: string,
  config: BuildConfig,
  options: PrebuildOptions,
): Promise<void> => {
  logger.debug(`Walking and transforming from ${srcDir} to ${destDir}`);
  const entries = await fs.readdir(srcDir);
  await Promise.all(
    entries.map(async entry => {
      const srcEntry = path.join(srcDir, entry);
      const destEntry = path.join(destDir, entry);
      const stat = await fs.lstat(srcEntry);
      if (stat.isDirectory()) {
        logger.debug(`Creating directory ${destEntry}`);
        await fs.mkdir(destEntry, {recursive: true});
        await walkAndTransform(srcEntry, destEntry, config, options);
      } else {
        logger.debug(
          `Copying and transforming file ${srcEntry} to ${destEntry}`,
        );
        await fs.copyFile(srcEntry, destEntry);
        await verifyFileReady(destEntry);
        await applyTransform(destEntry, config, options);
      }
    }),
  );
};

/**
 * Transforms templates for a specific platform using the appropriate transformers
 * @param templateType - Type of template to transform
 * @param platform - Target platform (iOS or Android)
 * @param version - Version string to match
 * @param destDir - Destination directory path
 * @param build - Build configuration object
 * @param options - Prebuild options
 * @param required - Whether the template is required (throws error if not found when true)
 */
const transformRNTemplates = async (
  templateType: RNTemplateType,
  platform: 'ios' | 'android',
  version: string,
  destDir: string,
  build: BuildConfig,
  options: PrebuildOptions,
  required: boolean = true,
): Promise<void> => {
  logger.info(`Transforming ${templateType} templates for ${platform}`);
  const templatePath = getRNTemplatePath(templateType, platform, version);
  if (!(await fs.exists(templatePath))) {
    if (required) {
      logger.error(`Required template not found: ${templatePath}`);
      throw new Error(
        `${templateType} template for ${platform} version ${version} not found.`,
      );
    }
    logger.warn(`Optional template not found: ${templatePath}`);
    return;
  }
  await walkAndTransform(templatePath, destDir, build, options);
};

/**
 * Locates and applies dependency-specific file templates,
 * if the project states the dependency in it's package.json
 *
 * @param platform - The target platform (iOS or Android)
 * @param destDir - Destination directory path
 * @param build - Build configuration object
 * @param options - Prebuild options
 */
const transformDependencyTemplates = async (
  platform: 'ios' | 'android',
  destDir: string,
  build: BuildConfig,
  options: PrebuildOptions,
): Promise<void> => {
  logger.info(`Transforming dependency file templates for ${platform}`);
  const dependencyFilesRoot = resolveTemplatePath('dependency-files');
  if (!(await fs.exists(dependencyFilesRoot))) {
    logger.warn(`No dependency files directory found. Skipping.`);
    return;
  }

  // Array of dependencies the template package has files for, where each entry is a tuple of [dependencyName, directoryName]
  const dependencyList = (
    await fs.readdir(dependencyFilesRoot, {withFileTypes: true})
  )
    .filter(it => it.isDirectory())
    // because slashes are not allowed in file names, we encode them as "+" in the filesystem.
    .map<[string, string]>(it => [it.name.replaceAll('+', '/'), it.name]);

  const pkgJson = getProjectPackageJson();
  const projectDependencies = [
    ...Object.keys(pkgJson.dependencies || {}),
    ...Object.keys(pkgJson.devDependencies || {}),
  ];

  for (const [dependencyName, dirName] of dependencyList) {
    if (projectDependencies.includes(dependencyName)) {
      logger.debug(`Found dependency ${dependencyName}, transforming files`);
      const dependencyFilesPath = path.join(
        dependencyFilesRoot,
        dirName,
        platform,
      );
      if (!(await fs.exists(dependencyFilesPath))) {
        logger.debug(
          `Dependency files for '${dependencyName}' does not exist for ${platform}. Skipping.`,
        );
        continue;
      }
      await walkAndTransform(dependencyFilesPath, destDir, build, options);
    } else {
      logger.debug(
        `Skipping dependency ${dependencyName}, not found in project dependencies`,
      );
    }
  }
};

/**
 * Plugin definition with platform-specific build processes
 */
export default definePlugin({
  /**
   * iOS build process
   * @param build - Build configuration object
   * @param options - Prebuild options
   */
  ios: async (build: BuildConfig, options: PrebuildOptions) => {
    logger.info('Starting iOS template generation');
    const destDir = path.project.resolve('ios');
    await fs.mkdir(destDir);
    await transformRNTemplates(
      'react-native',
      'ios',
      flagshipVersion.getReactNativeVersion(),
      destDir,
      build,
      options,
      true,
    );
    await transformRNTemplates(
      'supporting-files',
      'ios',
      flagshipVersion.getReactNativeVersion(),
      destDir,
      build,
      options,
      false,
    );
    await transformDependencyTemplates('ios', destDir, build, options);
    logger.info('Completed iOS template generation');
  },

  /**
   * Android build process
   * @param build - Build configuration object
   * @param options - Prebuild options
   */
  android: async (build: BuildConfig, options: PrebuildOptions) => {
    logger.info('Starting Android template generation');
    const destDir = path.project.resolve('android');
    await fs.mkdir(destDir);
    await transformRNTemplates(
      'react-native',
      'android',
      flagshipVersion.getReactNativeVersion(),
      destDir,
      build,
      options,
      true,
    );
    await transformRNTemplates(
      'supporting-files',
      'android',
      flagshipVersion.getReactNativeVersion(),
      destDir,
      build,
      options,
      false,
    );
    await transformDependencyTemplates('android', destDir, build, options);

    logger.info('Renaming Android package namespace');
    // Rename android package namespace to updated package name for both debug and main packages
    await Promise.all(
      ['debug', 'main', 'release'].map(it =>
        flagshipFs.renameAndCopyDirectory(
          'com.app',
          build.android.packageName,
          path.project.resolve('android', 'app', 'src', it, 'java'),
        ),
      ),
    ).catch(e => {
      logger.error('Failed to rename Android directories');
      throw Error(
        `Error: unable to rename android directories to updated package name, ${e.message}`,
      );
    });

    logger.info('Updating package names in Java files');
    // Replace package namespace in Java files for debug, main, and release builds
    await globAndReplace(
      'android/**/{debug,main,release}/**/*.{java,kt}',
      /package\s+com\.app/,
      `package ${build.android.packageName};`,
    ).catch(e => {
      logger.error('Failed to update package names');
      throw Error(
        `Error: unable to to update package names in native android files, ${e.message}`,
      );
    });

    logger.info('Completed Android template generation');
  },
});
