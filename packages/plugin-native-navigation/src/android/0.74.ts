import {
  BuildConfig,
  fs,
  path,
  PrebuildOptions,
  withUTF8,
} from '@brandingbrand/code-cli-kit';

import {android as android73} from '../android/0.73';

/**
 * Performs Android-specific build configuration modifications
 *
 * This function:
 * 1. Runs the base Android 0.73 configuration
 * 2. Locates the react-native-navigation package
 * 3. Updates ReactTypefaceUtils.java to use ReactConstants instead of ReactTextShadowNode
 *
 * @param build - The build configuration object containing project settings
 * @param options - Prebuild options that customize the build process
 * @returns Promise that resolves when modifications are complete
 */
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
