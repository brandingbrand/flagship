import {defineBuild} from '@brandingbrand/code-cli-kit';
import type {CodePluginAsset} from '@brandingbrand/code-plugin-asset';
import type {CodePluginAppIcon} from '@brandingbrand/code-plugin-app-icon';
import type {CodePluginPermissions} from '@brandingbrand/code-plugin-permissions';
import type {CodePluginSplashScreen} from '@brandingbrand/code-plugin-splash-screen';
import type {CodePluginFastlane} from '@brandingbrand/code-plugin-fastlane';

export default defineBuild<
  CodePluginAsset &
    CodePluginAppIcon &
    CodePluginPermissions &
    CodePluginSplashScreen &
    CodePluginFastlane
>({
  ios: {
    bundleId: 'com.brandingbrand',
    displayName: 'Branding Brand',
    frameworks: [
      {
        framework: 'SpriteKit.framework',
      },
    ],
  },
  android: {
    packageName: 'com.brandingbrand',
    displayName: 'Branding Brand',
    signing: {
      storeFile: './coderc/signing/release.keystore',
      keyAlias: 'androiddebugkey',
    },
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
  codePluginFastlane: {
    plugin: {
      android: {
        appCenter: {
          organization: 'Branding-Brand',
          appName: 'Example-Android-Store',
          destinationType: 'group',
          destinations: ['IAT'],
        },
      },
    },
  },
});
