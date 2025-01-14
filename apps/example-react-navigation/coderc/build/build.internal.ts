import {defineBuild} from '@brandingbrand/code-cli-kit';
import type {CodePluginAsset} from '@brandingbrand/code-plugin-asset';
import type {CodePluginAppIcon} from '@brandingbrand/code-plugin-app-icon';
import type {CodePluginSplashScreen} from '@brandingbrand/code-plugin-splash-screen';

export default defineBuild<
  CodePluginAsset & CodePluginAppIcon & CodePluginSplashScreen
>({
  ios: {
    bundleId: 'com.brandingbrand',
    displayName: 'Branding Brand',
    plist: {
      urlScheme: {
        scheme: 'app',
      },
    },
  },
  android: {
    packageName: 'com.brandingbrand',
    displayName: 'Branding Brand',
  },
  codePluginAsset: {
    plugin: {
      assetPath: ['./coderc/assets/fonts'],
    },
  },
  codePluginAppIcon: {
    plugin: {
      appIconPath: './coderc/assets/app-icon',
      iconInsets: 20,
    },
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
});
