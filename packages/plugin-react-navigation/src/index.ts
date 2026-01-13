/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type BuildConfig,
  definePlugin,
  path,
  string,
  withManifest,
  withUTF8,
} from '@brandingbrand/code-cli-kit';


export default definePlugin({
  android: async function (
    build: BuildConfig,
  ): Promise<void> {

    const mainActivityPath = path.android.mainActivity(build);

    await withUTF8(
      mainActivityPath,
      (content) => {

        const imports = [
          'android.os.Bundle',
          'com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory',
        ].filter((imp) => !content.includes(`import ${imp}`));
        if (imports.length > 0) {
          content = string.replace(
            content,
            /(package.*?\n\n)/m,
            `$1import ${imports.join('\nimport ')}\n`,
          );
        }

        if (!content.includes('super.onCreate(')) {
            content = string.replace(
              content,
              /(class MainActivity.*\{)/,
              `$1
  override fun onCreate(savedInstanceState: Bundle?) {
      super.onCreate(savedInstanceState)
  }`,
            );
        }

        if (!content.includes('supportFragmentManager.fragmentFactory =')) {
          content = string.replace(
            content,
            /(super\.onCreate\(.+\))/,
             `supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
      $1`,
          );
        }

        return content;
      },
    );

    await withManifest((xml) => {
      const mainApplication = xml.manifest.application?.find(it => it.$['android:name'] === '.MainApplication');
      if (!mainApplication)
        throw new Error('Application ".MainApplication" not found in AndroidManifest.xml');

      // Predictive back navigation not supported by RNavigation at present
      // https://reactnavigation.org/docs/getting-started?framework=community-cli#opting-out-of-predictive-back-on-android
      mainApplication.$['android:enableOnBackInvokedCallback'] = 'false';

      return xml;
    });
  },
});
