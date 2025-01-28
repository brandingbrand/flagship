import {ImageRequireSource} from 'react-native';

import {AppTheme, ColorToken, Themeable} from './theme';

/**
 * Metadata for icon sheet
 */
export type AssetMetadata = {
  source: ImageRequireSource | Themeable<ImageRequireSource>;
  width: number;
  height: number;
  color?: ColorToken;
};

export type AssetManifest = Record<string, AssetMetadata>;

export function resolveAssetSource(
  meta: AssetMetadata,
  theme: AppTheme = 'light',
): ImageRequireSource {
  return typeof meta.source === 'object' ? meta.source[theme] : meta.source;
}
