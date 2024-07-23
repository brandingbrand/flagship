/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "generated_fixtures", "reactNativeVersion": "0.73"}
 */

jest.mock('fs-extra');

import {
  type BuildConfig,
  withPbxproj,
  path,
  fs,
} from '@brandingbrand/code-cli-kit';

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
          type: 'generated',
          generated: {
            logoPath: './coderc/assets/splash-screen/logo.png',
            backgroundColor: '#fff',
          },
        },
        android: {
          type: 'generated',
          generated: {
            logoPath: './coderc/assets/splash-screen/logo.png',
            backgroundColor: '#fff',
          },
        },
      },
    },
  };

  const generate = jest
    .spyOn(
      require(
        require.resolve('react-native-bootsplash/dist/commonjs/generate.js'),
      ),
      'generate',
    )
    .mockImplementation(jest.fn());

  it('android', async () => {
    await plugin.android?.(config, {} as any);

    expect(generate).toHaveBeenCalledWith({
      flavor: 'main',
      logo: path.project.resolve('./coderc/assets/splash-screen/logo.png'),
      background: '#fff',
      logoWidth: 180,
      assetsOutput: null,
      platforms: ['android'],
      android: {
        sourceDir: path.project.resolve('android'),
        appName: 'app',
      },
    });
    expect(
      await fs.readFile(
        path.project.resolve(
          'android',
          'app',
          'src',
          'main',
          'res',
          'layout',
          'splash.xml',
        ),
        'utf-8',
      ),
    ).toContain('android:background="#fff">');
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
