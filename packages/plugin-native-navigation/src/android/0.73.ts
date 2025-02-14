import {
  BuildConfig,
  path,
  PrebuildOptions,
  string,
  withUTF8,
} from '@brandingbrand/code-cli-kit';

/**
 * Configures an Android project for React Native Navigation
 *
 * @param build - Build configuration object containing project settings
 * @param _options - Additional prebuild options (currently unused)
 *
 * This function makes the following modifications:
 * 1. Updates build.gradle to set RNNKotlinVersion
 * 2. Modifies MainActivity to extend NavigationActivity
 * 3. Updates MainApplication to use NavigationApplication and NavigationReactNativeHost
 *
 * @returns Promise that resolves when all modifications are complete
 */
export async function android(build: BuildConfig, _options: PrebuildOptions) {
  /**
   * Updates build.gradle to set RNNKotlinVersion equal to kotlinVersion
   */
  await withUTF8(path.android.buildGradle, content => {
    return string.replace(
      content,
      /(\n)(\s+)(kotlinVersion.*)/m,
      `$1$2$3
$2RNNKotlinVersion = kotlinVersion`,
    );
  });

  /**
   * Modifies MainActivity.kt to:
   * 1. Import NavigationActivity
   * 2. Extend NavigationActivity class
   */
  await withUTF8(path.android.mainActivity(build), content => {
    content = string.replace(
      content,
      /(package.*)/m,
      `$1

import com.reactnativenavigation.NavigationActivity`,
    );

    return string.replace(
      content,
      /class[.\s\S{]*/m,
      `class MainActivity : NavigationActivity() {

}
`,
    );
  });

  /**
   * Updates MainApplication.kt to:
   * 1. Import required Navigation classes
   * 2. Extend NavigationApplication
   * 3. Replace DefaultReactNativeHost with NavigationReactNativeHost
   */
  await withUTF8(path.android.mainApplication(build), content => {
    content = string.replace(
      content,
      /(package.*)/m,
      `$1

import com.reactnativenavigation.NavigationApplication
import com.reactnativenavigation.react.NavigationReactNativeHost
`,
    );

    content = string.replace(
      content,
      /(class.*)/m,
      `class MainApplication : NavigationApplication() {`,
    );

    return string.replace(
      content,
      /DefaultReactNativeHost(\(this\))/m,
      `NavigationReactNativeHost$1`,
    );
  });
}
