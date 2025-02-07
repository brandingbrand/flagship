import fs, {promises as fsp} from 'fs';
import path from 'path';

import Sharp from 'sharp';

import {AssetIndexConfig} from '../config';

import {AssetMetadataGeneratorOpts} from './codegen';
import {isManagedAssetDir} from './config';
import {
  assertValidAssetData,
  isHighDensityVariant,
  isValidImageAsset,
} from './guards';
import {resolveAssetPathInfo} from './paths';
import {resolveAssetColor} from './color-resolve';

export function findManagedAssetDirs(assetRoot: string): string[] {
  if (!fs.existsSync(assetRoot))
    throw new Error(`Directory not found: ${assetRoot}`);

  return fs
    .readdirSync(assetRoot)
    .filter(dir => isManagedAssetDir(path.resolve(assetRoot, dir)));
}

export async function findAssets(
  assetDir: string,
  {
    assetModes,
    colorRules,
    defaultColor,
    assetNameTransform,
  }: AssetIndexConfig<string>,
): Promise<AssetMetadataGeneratorOpts[]> {
  if (!fs.existsSync(assetDir))
    throw new Error(`Directory not found: ${assetDir}`);

  let fileList = await fsp.readdir(assetDir, {recursive: true});

  const assetData: AssetMetadataGeneratorOpts[] = [];
  const knownAssets = new Map<string, string>();

  while (fileList.length) {
    const relativeFilePath = fileList.shift();
    let filePath = relativeFilePath
      ? path.resolve(assetDir, relativeFilePath)
      : undefined;

    if (
      !filePath ||
      !isValidImageAsset(filePath) ||
      isHighDensityVariant(filePath)
    ) {
      continue;
    }

    const pathInfo = resolveAssetPathInfo(filePath, assetDir, assetModes);

    if (pathInfo.hasModes) {
      const assetPaths = Object.values(pathInfo.requirePaths);
      fileList = fileList.filter(file => !assetPaths.includes(file));
    }

    if (knownAssets.has(pathInfo.assetName)) {
      throw new Error(
        `Duplicate asset name found: ${
          pathInfo.assetName
        } between '${filePath}' and '${knownAssets.get(pathInfo.assetName)}'`,
      );
    }
    knownAssets.set(pathInfo.assetName, filePath);

    const imageData = await Sharp(filePath).metadata();
    const compareImageData: [string, Sharp.Metadata][] | undefined =
      pathInfo.hasModes
        ? await Promise.all(
            Object.values(pathInfo.requirePaths).map(async requirePath => {
              return [
                path.basename(requirePath),
                await Sharp(path.resolve(assetDir, requirePath)).metadata(),
              ];
            }),
          )
        : undefined;

    assertValidAssetData(pathInfo.assetName, imageData, compareImageData);

    assetData.push({
      color: resolveAssetColor(
        pathInfo.assetName,
        pathInfo.hasModes,
        colorRules,
        defaultColor,
      ),
      height: imageData.height,
      name: assetNameTransform?.(pathInfo.assetName) ?? pathInfo.assetName,
      source: pathInfo.requirePaths,
      width: imageData.width,
    });
  }

  return assetData;
}
