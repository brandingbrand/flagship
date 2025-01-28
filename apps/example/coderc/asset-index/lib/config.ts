import fs from 'fs';
import path from 'path';

import {bundleRequire} from 'bundle-require';

import {AssetIndexConfig} from '../config';

const INDEX_CONFIG_FILENAME = 'index.config.ts';

export function isManagedAssetDir(assetDir: string): boolean {
  // check if path is a directory that contains a metagen config file.
  return (
    fs.lstatSync(assetDir).isDirectory() &&
    fs.existsSync(path.resolve(assetDir, INDEX_CONFIG_FILENAME))
  );
}

export function isAssetIndexConfig<TokenT extends string = string>(
  obj: any,
): obj is AssetIndexConfig<TokenT> {
  return obj?.__INDEX_CONFIG === true;
}

export async function readAssetIndexConfig(
  assetDir: string,
): Promise<[AssetIndexConfig<string>, string]> {
  const filepath = path.resolve(assetDir, INDEX_CONFIG_FILENAME);
  const file = await bundleRequire({filepath});

  const config = file?.mod?.default;
  if (!isAssetIndexConfig(config))
    throw new Error(`Invalid asset manifest config file: ${filepath}`);

  return [config, filepath];
}
