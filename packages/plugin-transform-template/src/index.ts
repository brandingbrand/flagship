import fs from 'fs-extra';
import {
  fs as flagshipFs,
  path,
  definePlugin,
  BuildConfig,
  PrebuildOptions,
  version,
  globAndReplace,
} from '@brandingbrand/code-cli-kit';

import {transformers} from './transformers';
import {transforms} from './transforms';

type TemplateType = 'react-native' | 'supporting-files';

const getTemplatePath = (
  templateType: TemplateType,
  platform: 'ios' | 'android',
  version: string,
): string => {
  return path.join(
    require.resolve('@brandingbrand/code-templates/package.json'),
    '..',
    templateType,
    version,
    platform,
  );
};

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
        await applyTransform(destEntry, config, options);
      }
    }),
  );
};

const applyTransform = async (
  destEntry: string,
  config: BuildConfig,
  options: PrebuildOptions,
): Promise<void> => {
  const transformerEntry = transformers.find(t => t.test.test(destEntry));
  const transformsEntry = Object.values(transforms).find(predicate =>
    predicate.__test.test(destEntry),
  );

  if (transformerEntry && transformsEntry) {
    const {__test, ...passTransforms} = transformsEntry;
    await transformerEntry.use(config, options, passTransforms, destEntry);
  }
};

const transformTemplates = async (
  templateType: TemplateType,
  platform: 'ios' | 'android',
  version: string,
  destDir: string,
  build: BuildConfig,
  options: PrebuildOptions,
  required: boolean = true,
): Promise<void> => {
  const templatePath = getTemplatePath(templateType, platform, version);
  if (!(await fs.exists(templatePath))) {
    if (required) {
      throw new Error(
        `${templateType} template for ${platform} version ${version} not found.`,
      );
    }
    return;
  }
  await walkAndTransform(templatePath, destDir, build, options);
};

export default definePlugin({
  ios: async (build: BuildConfig, options: PrebuildOptions) => {
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
  },
  android: async (build: BuildConfig, options: PrebuildOptions) => {
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
      throw Error(
        `Error: unable to rename android directories to updated package name, ${e.message}`,
      );
    });

    // Replace package namespace in Java files for debug, main, and release builds
    await globAndReplace(
      'android/**/{debug,main,release}/**/*.{java,kt}',
      /package\s+com\.app/,
      `package ${build.android.packageName};`,
    ).catch(e => {
      throw Error(
        `Error: unable to to update package names in native android files, ${e.message}`,
      );
    });
  },
});
