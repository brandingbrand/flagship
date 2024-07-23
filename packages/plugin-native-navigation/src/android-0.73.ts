import {
  BuildConfig,
  path,
  PrebuildOptions,
  string,
  withUTF8,
} from '@brandingbrand/code-cli-kit';

export async function android(build: BuildConfig, _options: PrebuildOptions) {
  await withUTF8(path.android.buildGradle, content => {
    return string.replace(
      content,
      /(\n)(\s+)(kotlinVersion.*)/m,
      `$1$2$3
$2RNNKotlinVersion = kotlinVersion`,
    );
  });

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
