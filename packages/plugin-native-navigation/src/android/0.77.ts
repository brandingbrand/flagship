import {
  BuildConfig,
  fs,
  path,
  string,
  PrebuildOptions,
  withUTF8,
} from '@brandingbrand/code-cli-kit';

import {android as android73} from '../android/0.73';

/**
 * Performs Android-specific build configuration modifications
 *
 * This function:
 * 1. Runs the base Android 0.73 configuration
 * 2. Remove SoLoader and load the native entry point for this app
 *
 * @param build - The build configuration object containing project settings
 * @param options - Prebuild options that customize the build process
 * @returns Promise that resolves when modifications are complete
 */
export async function android(build: BuildConfig, options: PrebuildOptions) {
  await android73(build, options);

  await withUTF8(path.android.mainApplication(build), content => {
    content = string.replace(
      content,
      /SoLoader\.init\(\s*this\s*,\s*OpenSourceMergedSoMapping\s*\);?/,
      ''
    )

    content = string.replace(
      content,
      /if\s*\(\s*BuildConfig\.IS_NEW_ARCHITECTURE_ENABLED\s*\)\s*\{[\s\S]*?load\(\)\s*[\s}]*?\}/,
      ''
    )

    return content;
  });
}
