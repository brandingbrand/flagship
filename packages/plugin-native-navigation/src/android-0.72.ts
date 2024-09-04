import {
  BuildConfig,
  fs,
  path,
  PrebuildOptions,
  string,
  withUTF8,
} from '@brandingbrand/code-cli-kit';

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
