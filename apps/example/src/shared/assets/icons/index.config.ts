import {defineAssetIndexConfig} from '../../../../coderc/asset-index/config';

import type {ColorTokenKey} from '@/shared/lib/theme';

export default defineAssetIndexConfig<ColorTokenKey>({
  assetModes: {
    dark: 'Dark',
    light: 'Light',
  },
  colorRules: {
    'star(Empty|Full|Half)': 'warningFg',
    'success(Fill|Outline)': 'successFg',
    'info(Fill|Outline)': 'infoFg',
    'warning(Fill|Outline)': 'warningFg',
    'danger(Fill|Outline)': 'dangerFg',
    'creditcard[A-Za-z]+': false,
  },
  defaultColor: 'neutralFgPrimary',
  outputMode: 'AssetManifest',
});
