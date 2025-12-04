import {defineBuild} from '@brandingbrand/code-cli-kit';
import type {CodePluginAsset} from '@brandingbrand/code-plugin-asset';
import type {CodePluginAppIcon} from '@brandingbrand/code-plugin-app-icon';
import type {CodePluginPermissions} from '@brandingbrand/code-plugin-permissions';
import type {CodePluginSplashScreen} from '@brandingbrand/code-plugin-splash-screen';
import type {CodePluginEnvironment} from '@brandingbrand/code-plugin-env';

export default defineBuild<
  CodePluginAsset &
    CodePluginAppIcon &
    CodePluginPermissions &
    CodePluginSplashScreen &
    CodePluginEnvironment
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
      universalIcon: './coderc/assets/universal.png',
      backgroundIcon: './coderc/assets/background.png',
      foregroundIcon: './coderc/assets/foreground.png',
      notificationIcon: './coderc/assets/notification.png',
    },
  },
  codePluginPermissions: {
    plugin: {
      ios: [
        {
          permission: 'Camera',
          text: 'Let me use the camera',
        },
      ],
      android: ['CAMERA'],
    },
  },
  codePluginSplashScreen: {
    plugin: {
      splashImage: './coderc/assets/splash.png',
    },
  },
  codePluginEnvironment: {
    plugin: {
      hiddenEnvs: ['store'],
    },
  },
});
