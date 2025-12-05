import {
  BuildConfig,
  fs,
  path,
  PrebuildOptions,
  withUTF8,
} from '@brandingbrand/code-cli-kit';

/**
 * Performs IOS-specific build configuration modifications
 *
 * @param build - The build configuration object containing project settings
 * @param options - Prebuild options that customize the build process
 * @returns Promise that resolves when modifications are complete
 */
export async function ios(build: BuildConfig, options: PrebuildOptions) {
  // Resolve path to react-native-navigation postlink path module
  const rnnPath = require.resolve(
    'react-native-navigation/autolink/postlink/path.js',
    {paths: [process.cwd()]},
  );

  // Update mainApplicationJava in postlink path module
  await fs.update(rnnPath, /(mainApplicationJava)\S*(replace)/, `$1?.$2`);

  // Resolve path to react-native-navigation postlink IOS script
  const scriptPath = require.resolve(
    'react-native-navigation/autolink/postlink/postLinkIOS.js',
    {paths: [process.cwd()]},
  );

  // Set executable permission for postlink IOS script
  await fs.chmod(scriptPath, '755');

  // Require postlink IOS script
  const rnnIOSLink = require(scriptPath);

  // Execute postlink IOS script
  await rnnIOSLink();
}
