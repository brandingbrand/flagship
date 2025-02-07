import {defineAssetIndexConfig} from '../../../../coderc/asset-index/config';

import {ColorTokenKey} from '@/shared/lib/theme';

export default defineAssetIndexConfig<ColorTokenKey>({
  assetNameTransform: tabName => {
    const name = tabName.replace(/^tab/, '');
    return `${name.charAt(0).toLowerCase()}${name.slice(1)}`;
  },
  outputMode: 'RequireMap',
});
