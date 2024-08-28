import {
  BuildConfig,
  fs,
  path,
  PrebuildOptions,
  withUTF8,
} from '@brandingbrand/code-cli-kit';

import {android as android73} from './android-0.73';

export async function android(build: BuildConfig, options: PrebuildOptions) {
  await android73(build, options);

  const reactNativeNavigationPath = require.resolve(
    'react-native-navigation/package.json',
    {
      paths: [process.cwd()],
    },
  );

  const reactTypefaceUtilsPath = path.resolve(
    reactNativeNavigationPath,
    '..',
    'lib',
    'android',
    'app',
    'src',
    'main',
    'java',
    'com',
    'reactnativenavigation',
    'utils',
    'ReactTypefaceUtils.java',
  );

  if (!(await fs.doesPathExist(reactTypefaceUtilsPath))) return;

  await withUTF8(reactTypefaceUtilsPath, content => {
    // Don't use string.replace because don't care if it doesn't exist
    content = content.replaceAll(
      /import\s+[\w.]*ReactTextShadowNode.*/gm,
      'import com.facebook.react.common.ReactConstants;',
    );

    // Don't use string.replace because don't care if it doesn't exist
    content = content.replaceAll(
      'ReactTextShadowNode.UNSET',
      'ReactConstants.UNSET',
    );

    return content;
  });
}
