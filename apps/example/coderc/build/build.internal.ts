import {defineBuild} from '@brandingbrand/code-cli-kit';
import type {CodePluginAsset} from '@brandingbrand/code-plugin-asset';
import type {CodePluginAppIcon} from '@brandingbrand/code-plugin-app-icon';
import type {CodePluginPermissions} from '@brandingbrand/code-plugin-permissions';

export default defineBuild<
  CodePluginAsset & CodePluginAppIcon & CodePluginPermissions
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
});
