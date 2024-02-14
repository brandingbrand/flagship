import {defineBuild} from '@brandingbrand/code-cli-kit';
import type {CodePluginAsset} from '@brandingbrand/code-plugin-asset';

export default defineBuild<CodePluginAsset>({
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
});
