/**
 * @jest-environment-options {"requireTemplate": true, "reactNativeVersion": "0.73"}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {fs, path} from '@brandingbrand/code-cli-kit';

import plugin from '../src';

describe('plugin-native-navigation', () => {
  it('android react-native 0.73', async () => {
    const build = {
      ios: {
        bundleId: 'com.app',
        displayName: 'app',
      },
      android: {
        packageName: 'com.app',
        displayName: 'app',
      },
    };
    await plugin.android?.(build, {} as any);

    const buildGradle = await fs.readFile(path.android.buildGradle, 'utf-8');
    const mainApplication = await fs.readFile(
      path.android.mainApplication(build),
      'utf-8',
    );
    const mainActivity = await fs.readFile(
      path.android.mainActivity(build),
      'utf-8',
    );

    expect(buildGradle).toContain('RNNKotlinVersion = kotlinVersion');
    expect(mainApplication).toContain(
      'import com.reactnativenavigation.NavigationApplication',
    );
    expect(mainApplication).toContain(
      'import com.reactnativenavigation.react.NavigationReactNativeHost',
    );
    expect(mainApplication).toContain(
      'class MainApplication : NavigationApplication() {',
    );
    expect(mainApplication).toContain('NavigationReactNativeHost');
    expect(mainActivity).toContain(
      'import com.reactnativenavigation.NavigationActivity',
    );
    expect(mainActivity).toContain(
      'class MainActivity : NavigationActivity() {',
    );
  });
});
