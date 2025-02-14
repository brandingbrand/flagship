import {
  BuildConfig,
  fs,
  path,
  PrebuildOptions,
  string,
  withUTF8,
} from '@brandingbrand/code-cli-kit';

/**
 * Handles Android-specific build configuration and setup
 *
 * @param build - The build configuration object containing Android-specific settings
 * @param build.android - Android build configuration
 * @param build.android.gradle - Gradle configuration settings
 * @param build.android.gradle.projectGradle - Project level gradle configuration
 * @param build.android.gradle.projectGradle.kotlinVersion - Version of Kotlin to use
 * @param _options - Build options (currently unused)
 *
 * @remarks
 * This function performs several key tasks:
 * 1. If a Kotlin version is specified, updates the build.gradle file to include the Kotlin plugin
 * 2. Sets up react-native-navigation by:
 *    - Resolving the path to the postlink Android script
 *    - Setting proper executable permissions
 *    - Executing the postlink script
 *
 * @throws Will throw an error if file operations fail or if the react-native-navigation script cannot be found/executed
 */
export async function android(build: BuildConfig, _options: PrebuildOptions) {
  if (build.android.gradle?.projectGradle?.kotlinVersion) {
    await withUTF8(path.android.buildGradle, content => {
      return string.replace(
        content,
        /(dependencies\s*{\s*?\n(\s+))/m,
        `$1classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:${build.android.gradle?.projectGradle?.kotlinVersion}'\n$2`,
      );
    });
  }

  // Resolve path to react-native-navigation postlink Android script
  const scriptPath = require.resolve(
    'react-native-navigation/autolink/postlink/postLinkAndroid.js',
    {paths: [process.cwd()]},
  );

  // Set executable permission for postlink Android script
  await fs.chmod(scriptPath, '755');

  // Require postlink Android script
  const rnnAndroidLink = require(scriptPath);

  // Execute postlink Android script
  await rnnAndroidLink();
}
