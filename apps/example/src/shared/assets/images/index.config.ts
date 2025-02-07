import {defineAssetIndexConfig} from '../../../../coderc/asset-index/config';

import {ColorTokenKey} from '@/shared/lib/theme';

export default defineAssetIndexConfig<ColorTokenKey>({
  assetModes: {
    dark: 'Dark',
    light: 'Light',
  },
  outputMode: 'AssetManifest',
});
