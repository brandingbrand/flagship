import fs from 'fs-extra';
import {
  fs as flagshipFs,
  path,
  definePlugin,
  BuildConfig,
  PrebuildOptions,
  version,
  globAndReplace,
  logger,
} from '@brandingbrand/code-cli-kit';
import semver from 'semver';

import {transformers} from './transformers';
import {transforms} from './transforms';

/** Type representing the available template types */
type TemplateType = 'react-native' | 'supporting-files';

/**
 * Gets the filesystem path to a template based on type, platform and version
 * @param templateType - The type of template to locate
 * @param platform - The target platform (iOS or Android)
 * @param version - The version string to match
 * @returns The full filesystem path to the template
 */
const getTemplatePath = (
  templateType: TemplateType,
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
    const tryPath = path.join(
      require.resolve('@brandingbrand/code-templates/package.json'),
      '..',
      templateType,
      tryVersion,
      platform,
    );

    if (fs.existsSync(tryPath)) {
      return tryPath;
    }
  }

  throw new Error(
    `Template not found for ${templateType} ${platform} v${version}`,
  );
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
        await applyTransform(destEntry, config, options);
      }
    }),
  );
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
 * Transforms templates for a specific platform using the appropriate transformers
 * @param templateType - Type of template to transform
 * @param platform - Target platform (iOS or Android)
 * @param version - Version string to match
 * @param destDir - Destination directory path
 * @param build - Build configuration object
 * @param options - Prebuild options
 * @param required - Whether the template is required (throws error if not found when true)
 */
const transformTemplates = async (
  templateType: TemplateType,
  platform: 'ios' | 'android',
  version: string,
  destDir: string,
  build: BuildConfig,
  options: PrebuildOptions,
  required: boolean = true,
): Promise<void> => {
  logger.info(`Transforming ${templateType} templates for ${platform}`);
  const templatePath = getTemplatePath(templateType, platform, version);
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
    await transformTemplates(
      'react-native',
      'ios',
      version.getReactNativeVersion(),
      destDir,
      build,
      options,
      true,
    );
    await transformTemplates(
      'supporting-files',
      'ios',
      version.getReactNativeVersion(),
      destDir,
      build,
      options,
      false,
    );
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
    await transformTemplates(
      'react-native',
      'android',
      version.getReactNativeVersion(),
      destDir,
      build,
      options,
      true,
    );
    await transformTemplates(
      'supporting-files',
      'android',
      version.getReactNativeVersion(),
      destDir,
      build,
      options,
      false,
    );

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
