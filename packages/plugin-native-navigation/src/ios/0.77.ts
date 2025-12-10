import {
  path,
  fs,
  type BuildConfig,
  type PrebuildOptions,
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
  const rnnBasePath = path.dirname(
    require.resolve('react-native-navigation/package.json', {
      paths: [process.cwd()],
    }),
  );

  const rnnPathFilePath = path.resolve(
    rnnBasePath,
    'autolink',
    'postlink',
    'path.js',
  );

  // Update mainApplicationKotlin in postlink path module
  await fs.update(
    rnnPathFilePath,
    /(mainApplicationKotlin)\S*(replace)/,
    `$1?.$2`,
  );

  // Resolve path to react-native-navigation postlink IOS script
  const rnnPostLinkScriptPath = path.resolve(
    rnnBasePath,
    'autolink',
    'postlink',
    'postLinkIOS.js',
  );

  // Set executable permission for postlink IOS script
  await fs.chmod(rnnPostLinkScriptPath, '755');

  // Require postlink IOS script
  const rnnIOSLink = require(rnnPostLinkScriptPath);

  // Execute postlink IOS script
  await rnnIOSLink();
}
