import path from 'path';

import {assertExpectedAssetFile} from './guards';

type ParsedAssetInfo = {
  assetName: string;
} & (
  | {hasModes: false; requirePaths: string}
  | {hasModes: true; requirePaths: Record<string, string>}
);

export function resolveAssetModeRequirePaths(
  assetModes: Record<string, string>,
  rootDir: string,
  assetDir: string,
  assetName: string,
  extension: string,
) {
  const paths: Record<string, string> = {};

  for (const [modeKey, suffix] of Object.entries(assetModes)) {
    const modeAssetPath = path.resolve(
      assetDir,
      `${assetName}${suffix}${extension}`,
    );
    assertExpectedAssetFile(modeAssetPath);

    paths[modeKey] = path.relative(rootDir, modeAssetPath);
  }

  return paths;
}

export function resolveAssetPathInfo(
  filePath: string,
  rootDir: string,
  assetModes?: Record<string, string>,
): ParsedAssetInfo {
  const fileExt = path.extname(filePath);

  const assetDir = path.dirname(filePath);
  let assetName = path.basename(filePath, fileExt);

  if (assetModes) {
    // find if the file has a mode suffix.
    for (const suffix of Object.values(assetModes)) {
      if (assetName.endsWith(suffix)) {
        assetName = assetName.slice(0, -suffix.length);

        return {
          assetName,
          hasModes: true,
          requirePaths: resolveAssetModeRequirePaths(
            assetModes,
            rootDir,
            assetDir,
            assetName,
            fileExt,
          ),
        };
      }
    }
  }

  return {
    assetName,
    hasModes: false,
    requirePaths: path.relative(rootDir, filePath),
  };
}
