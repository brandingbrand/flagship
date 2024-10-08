/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "legacy_fixtures", "reactNativeVersion": "0.73"}
 */

import {fs, type BuildConfig, path} from '@brandingbrand/code-cli-kit';

import plugin, {type CodePluginSplashScreen} from '../src';

describe('plugin-splash-screen', () => {
  const config: BuildConfig & CodePluginSplashScreen = {
    ios: {
      bundleId: 'com.app',
      displayName: 'App',
    },
    android: {
      packageName: 'com.app',
      displayName: 'App',
    },
    codePluginSplashScreen: {
      plugin: {
        ios: {
          type: 'legacy',
          legacy: {
            xcassetsDir: './coderc/assets/splash-screen/ios',
            xcassetsFile: 'LaunchScreen.xcassets',
            storyboardFile: 'LaunchScreen.storyboard',
          },
        },
        android: {
          type: 'legacy',
          legacy: {
            assetsDir: './coderc/assets/splash-screen/android',
          },
        },
      },
    },
  };

  it('android', async () => {
    await plugin.android?.(config, {} as any);

    expect(
      await fs.doesPathExist(
        path.project.resolve(
          'android',
          'app',
          'src',
          'main',
          'res',
          'drawable',
        ),
      ),
    ).toBeTruthy();
    expect(
      await fs.doesPathExist(
        path.project.resolve(
          'android',
          'app',
          'src',
          'main',
          'res',
          'drawable-hdpi',
        ),
      ),
    ).toBeTruthy();
    expect(
      await fs.doesPathExist(
        path.project.resolve(
          'android',
          'app',
          'src',
          'main',
          'res',
          'drawable-mdpi',
        ),
      ),
    ).toBeTruthy();
    expect(
      await fs.doesPathExist(
        path.project.resolve(
          'android',
          'app',
          'src',
          'main',
          'res',
          'drawable-xhdpi',
        ),
      ),
    ).toBeTruthy();
    expect(
      await fs.doesPathExist(
        path.project.resolve(
          'android',
          'app',
          'src',
          'main',
          'res',
          'drawable-xxhdpi',
        ),
      ),
    ).toBeTruthy();
    expect(
      await fs.doesPathExist(
        path.project.resolve('android', 'app', 'src', 'main', 'res', 'layout'),
      ),
    ).toBeTruthy();
    expect(
      await fs.readFile(path.android.mainActivity(config), 'utf-8'),
    ).toContain(`import android.os.Bundle;`);
    expect(await fs.readFile(path.android.mainActivity(config), 'utf-8'))
      .toContain(`override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.splash)
    }`);
  });
});
