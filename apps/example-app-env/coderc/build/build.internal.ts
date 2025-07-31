import {defineBuild} from '@brandingbrand/code-cli-kit';
import type {CodePluginAsset} from '@brandingbrand/code-plugin-asset';
import type {CodePluginAppIcon} from '@brandingbrand/code-plugin-app-icon';
import type {CodePluginSplashScreen} from '@brandingbrand/code-plugin-splash-screen';

export default defineBuild<
  CodePluginAsset & CodePluginAppIcon & CodePluginSplashScreen
>(pkgJson => ({
  ios: {
    bundleId: 'com.brandingbrand',
    displayName: 'Branding Brand',
    versioning: {
      version: pkgJson.version ?? '1.0.0',
    },
    plist: {
      urlScheme: {
        scheme: 'app',
      },
    },
    podfile: {
      newArchEnabled: true,
    },
  },
  android: {
    packageName: 'com.brandingbrand',
    displayName: 'Branding Brand',
    versioning: {
      version: pkgJson.version ?? '1.0.0',
    },
    gradle: {
      properties: {
        newArchEnabled: true,
      },
    },
  },
  codePluginAsset: {
    plugin: {
      assetPath: ['./coderc/assets/fonts'],
    },
  },
  codePluginAppIcon: {
    plugin: {
      universalIcon: './coderc/assets/universal.png',
      backgroundIcon: './coderc/assets/background.png',
      foregroundIcon: './coderc/assets/foreground.png',
      notificationIcon: './coderc/assets/notification.png',
    },
  },
  codePluginSplashScreen: {
    plugin: {
      splashImage: './coderc/assets/splash.png',
    },
  },
}));
