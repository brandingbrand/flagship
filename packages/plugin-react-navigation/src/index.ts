/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  definePlugin,
  version,
  withManifest,
  type BuildConfig
} from '@brandingbrand/code-cli-kit';

import { rnScreens40 } from './rn-screens-android/4.0';
import { rnScreens416 } from './rn-screens-android/4.16';

export default definePlugin({
  android: async function (
    build: BuildConfig,
  ): Promise<void> {
    const rnScreensVersion = version.getPackageVersion('react-native-screens');
    const activityTransformer = version.selectWithVersion({
      '4.0': rnScreens40,
      '4.16': rnScreens416,
    }, rnScreensVersion, 'react-native-screens');

    await activityTransformer(build);

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
