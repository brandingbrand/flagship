import {defineBuild} from '@brandingbrand/code-cli-kit';
import type {CodePluginAsset} from '@brandingbrand/code-plugin-asset';
import type {CodePluginAppIcon} from '@brandingbrand/code-plugin-app-icon';
import type {CodePluginPermissions} from '@brandingbrand/code-plugin-permissions';
import type {CodePluginSplashScreen} from '@brandingbrand/code-plugin-splash-screen';

export default defineBuild<
  CodePluginAsset &
    CodePluginAppIcon &
    CodePluginPermissions &
    CodePluginSplashScreen
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
      universalIcon: './universal.png',
      backgroundIcon: './background.png',
      foregroundIcon: './foreground.png',
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
      splashImage: './splash.png',
    },
  },
});
