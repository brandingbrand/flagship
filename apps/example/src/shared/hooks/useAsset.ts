import {useEffect, useMemo} from 'react';
import {type ImageRequireSource} from 'react-native';

import {assets, icons, type AssetType, type IconType} from '../assets';
import {resolveColorToken, type ColorToken} from '../lib/theme';
import {type AssetManifest, type AssetMetadata} from '../lib/assets';

import {useTheme} from './useTheme';

interface AssetStyle {
  height: number;
  tintColor?: string;
  width: number;
}

export interface AssetOptions {
  color?: ColorToken | false;
  height?: number;
  width?: number;
}

const useAssetFromManifest = <T extends AssetManifest>(
  manifest: T,
  assetKey: keyof T,
  options: AssetOptions = {},
): [ImageRequireSource, AssetStyle] => {
  const theme = useTheme();
  const assetData = manifest[assetKey];
  if (!assetData) {
    throw new Error(`Asset not found in manifest: ${String(assetKey)}`);
  }

  useEffect(() => {
    warnAssetSize(String(assetKey), assetData, options.height, options.width);
  }, [assetData, assetKey, options]);

  const {color, height, width} = options;
  return useMemo(() => {
    const assetColorToken = color ?? assetData.color;

    const assetSource =
      typeof assetData.source === 'object'
        ? assetData.source[theme]
        : assetData.source;
    return [
      assetSource,
      {
        height: height ?? assetData.height,
        width: width ?? assetData.width,
        tintColor:
          typeof assetColorToken === 'string'
            ? resolveColorToken(assetColorToken, theme)
            : undefined,
      },
    ];
  }, [
    color,
    assetData.color,
    assetData.source,
    assetData.height,
    assetData.width,
    theme,
    height,
    width,
  ]);
};

const warnAssetSize = (
  name: string,
  meta: AssetMetadata,
  height?: number,
  width?: number,
) => {
  if (!__DEV__) {
    return;
  }

  const reqHeight = height ?? meta.height;
  const reqWidth = width ?? meta.width;

  if (reqWidth > meta.width || reqHeight > meta.height) {
    console.log(`Requested asset size is larger than the original dimensions. This will result in upscaling artifacts. Export and/or use an XL variant of the asset that is at least the requested size.
  Asset name: '${name}'
  - Original size: ${meta.width}x${meta.height}
  - Requested size: ${reqWidth}x${reqHeight}`);
  }
};

export const useIcon = (
  iconKey: IconType,
  options: AssetOptions = {},
): [ImageRequireSource, AssetStyle] =>
  useAssetFromManifest(icons, iconKey, options);

export const useAsset = (
  assetKey: AssetType,
  options: AssetOptions = {},
): [ImageRequireSource, AssetStyle] =>
  useAssetFromManifest(assets, assetKey, options);
