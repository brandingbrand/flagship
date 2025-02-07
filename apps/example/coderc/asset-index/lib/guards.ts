import fs from 'fs';
import path from 'path';

import {path as fsPath} from '@brandingbrand/code-cli-kit';
import Sharp from 'sharp';

const validImageExtensions = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp'];
export function isValidImageAsset(assetPath: string): boolean {
  if (!fs.existsSync(assetPath)) return false;

  const fileStat = fs.lstatSync(assetPath);
  if (!fileStat.isFile()) return false;

  const fileExt = path.extname(assetPath);
  // Fail for any file that is not a supported image.
  if (!validImageExtensions.includes(fileExt.slice(1).toLowerCase()))
    return false;

  return true;
}

export function isHighDensityVariant(assetPath: string): boolean {
  return /@\dx$/i.test(path.basename(assetPath, path.extname(assetPath)));
}

export function assertExpectedAssetFile(assetPath: string): void {
  if (!isValidImageAsset(assetPath)) {
    throw new Error(
      `Missing expected asset file at: ${path.relative(
        fsPath.project.resolve(),
        assetPath,
      )}`,
    );
  }
}

export function assertValidAssetData(
  assetBaseName: string,
  assetBase: Sharp.Metadata,
  compareAssets?: [string, Sharp.Metadata][],
): asserts assetBase is Sharp.Metadata & {width: number; height: number} {
  if (!assetBase.width || !assetBase.height) {
    throw new Error(`Invalid asset file: ${assetBaseName}`);
  }

  if (!compareAssets?.length) {
    return;
  }

  for (const [compareAssetName, compareAsset] of compareAssets) {
    if (
      assetBase.width !== compareAsset.width ||
      assetBase.height !== compareAsset.height
    ) {
      throw new Error(
        `Asset mode variant set should have matching dimensions:
    '${assetBaseName}' Resolution: ${assetBase.width} x ${assetBase.height} 
    '${compareAssetName}' Resolution: ${compareAsset.width} x ${compareAsset.height}`,
      );
    }

    if (assetBase.format !== compareAsset.format) {
      throw new Error(
        `Asset mode variant set should have matching formats:
    '${assetBaseName}' Format: ${assetBase.format}
    '${compareAssetName}' Format: ${compareAsset.format}`,
      );
    }
  }
}
