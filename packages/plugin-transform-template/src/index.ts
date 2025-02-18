import fs from 'fs-extra';
import {
  path,
  definePlugin,
  BuildConfig,
  PrebuildOptions,
  version,
} from '@brandingbrand/code-cli-kit';

import {transformers} from './transformers';
import {transforms} from './transforms';

/**
 * Returns the absolute path to the template directory for a given platform and React Native version.
 *
 * @param platform - The target platform, either 'ios' or 'android'
 * @param version - The React Native version string (e.g. '0.73')
 * @returns The absolute path to the template directory
 * @remarks Templates are expected to be located at: <code-templates package root>/react-native/<version>/<platform>
 */
const getTemplatePath = (
  platform: 'ios' | 'android',
  version: string,
): string => {
  return path.join(
    require.resolve('@brandingbrand/code-templates/package.json'),
    '..',
    'react-native',
    version,
    platform,
  );
};

/**
 * Recursively traverses a directory structure, copying files to a destination location while applying transformations.
 *
 * @param srcDir - The source directory to walk through
 * @param destDir - The destination directory to copy files to
 * @param config - The build configuration object
 * @param options - Prebuild options for the transformation process
 * @returns A Promise that resolves when all files have been processed
 * @remarks For each file encountered, it will:
 * 1. Create matching directory structure in the destination
 * 2. Copy the file to the destination
 * 3. Apply any matching transformers based on file path
 */
const walkAndTransform = async (
  srcDir: string,
  destDir: string,
  config: BuildConfig,
  options: PrebuildOptions,
): Promise<void> => {
  const entries = await fs.readdir(srcDir);
  await Promise.all(
    entries.map(async entry => {
      const srcEntry = path.join(srcDir, entry);
      const destEntry = path.join(destDir, entry);
      const stat = await fs.lstat(srcEntry);
      if (stat.isDirectory()) {
        await fs.mkdir(destEntry, {recursive: true});
        await walkAndTransform(srcEntry, destEntry, config, options);
      } else {
        await fs.copyFile(srcEntry, destEntry);
        await applyTransform(srcEntry, config, options);
      }
    }),
  );
};

/**
 * Applies transformations to a file if matching transformers are found.
 *
 * @param srcPath - The path to the source file to transform
 * @param config - The build configuration object
 * @param options - Prebuild options for the transformation process
 * @returns A Promise that resolves when transformations are complete
 * @remarks The function:
 * 1. Searches for a matching transformer using the file path
 * 2. Searches for matching transforms using the file path
 * 3. If both are found, applies the transformer with the matched transforms
 */
const applyTransform = async (
  srcPath: string,
  config: BuildConfig,
  options: PrebuildOptions,
): Promise<void> => {
  const transformerEntry = transformers.find(t => t.test.test(srcPath));
  const transformsEntry = Object.values(transforms).find(predicate =>
    predicate.__test.test(srcPath),
  );

  if (transformerEntry && transformsEntry) {
    const {__test, ...passTransforms} = transformsEntry;
    await transformerEntry.use(config, options, passTransforms);
  }
};

/**
 * Processes the template files for a specific platform and React Native version.
 *
 * @param platform - The target platform ('ios' or 'android')
 * @param version - The React Native version string
 * @param destDir - The destination directory for processed files
 * @param build - The build configuration object
 * @param options - Prebuild options for the transformation process
 * @returns A Promise that resolves when template processing is complete
 * @throws Error if the template directory for the specified platform/version is not found
 */
const transformTemplates = async (
  platform: 'ios' | 'android',
  version: string,
  destDir: string,
  build: BuildConfig,
  options: PrebuildOptions,
): Promise<void> => {
  const templatePath = getTemplatePath(platform, version);
  if (!(await fs.exists(templatePath))) {
    throw new Error(`Template for ${platform} version ${version} not found.`);
  }
  await walkAndTransform(templatePath, destDir, build, options);
};

/**
 * A plugin for transforming React Native template files during the build process.
 *
 * @remarks
 * This plugin provides platform-specific template processing:
 * - ios: Processes iOS template files
 * - android: Processes Android template files
 *
 * For each platform, it:
 * 1. Resolves the destination directory
 * 2. Gets the React Native version
 * 3. Copies and transforms template files
 *
 * @example
 * ```typescript
 * // In your build configuration:
 * plugins: [
 *   transformTemplatePlugin
 * ]
 * ```
 */
export default definePlugin({
  ios: async (build: BuildConfig, options: PrebuildOptions) => {
    const destDir = path.project.resolve('ios');
    await transformTemplates(
      'ios',
      version.getReactNativeVersion(),
      destDir,
      build,
      options,
    );
  },
  android: async (build: BuildConfig, options: PrebuildOptions) => {
    const destDir = path.project.resolve('android');
    await transformTemplates(
      'android',
      version.getReactNativeVersion(),
      destDir,
      build,
      options,
    );
  },
});
