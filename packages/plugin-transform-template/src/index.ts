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
 * Returns the template directory for a given platform and React Native version.
 * Assumes that templates are located at:
 *   <code-templates package root>/react-native/<version>/<platform>
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
 * Recursively walks through a directory, copying files to the destination.
 * For each file, applies any matching transformer (by testing the file path).
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
 * Searches the transformers array for an entry whose test regex matches the source file path.
 * If found, it calls the transformer's use() function to process the file.
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
 * Processes the template files for a given platform and React Native version.
 * It first verifies that the template folder exists, then walks through it and applies transformations.
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
 * Define the transform-template plugin.
 *
 * This plugin exposes three functions:
 *  - ios: copies and transforms iOS template files.
 *  - android: copies and transforms Android template files.
 *  - common: (optional) common steps (none in this example).
 *
 * The template version is taken from build.ios.templateVersion or build.android.templateVersion,
 * defaulting to '0.73' if not provided.
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
