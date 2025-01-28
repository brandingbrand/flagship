import fsp from 'fs/promises';
import path from 'path';

import {path as fsPath} from '@brandingbrand/code-cli-kit';
import prettier from 'prettier';

import {
  createAssetManifestFile,
  createAssetRequireMapFile,
  findAssets,
  findManagedAssetDirs,
  readAssetIndexConfig,
} from './lib';

async function generateAssetIndexes(assetRoot: string): Promise<void> {
  const assetDirs = findManagedAssetDirs(assetRoot);

  const generatedFiles = await Promise.all(
    assetDirs.map(async subDir => {
      const managedAssetDir = path.resolve(assetRoot, subDir);

      const [indexConfig, indexConfigPath] =
        await readAssetIndexConfig(managedAssetDir);

      const assetData = await findAssets(managedAssetDir, indexConfig);

      const {outputMode = 'AssetManifest'} = indexConfig;

      let assetIndexFile: string;
      switch (outputMode) {
        case 'AssetManifest':
          assetIndexFile = createAssetManifestFile(assetData);
          break;

        case 'RequireMap':
          assetIndexFile = createAssetRequireMapFile(assetData);
          break;

        default:
          throw new Error(`Invalid output mode: ${indexConfig.outputMode}`);
      }

      const prettierOptions = await prettier.resolveConfig(indexConfigPath);
      const formattedFile = await prettier.format(assetIndexFile, {
        ...prettierOptions,
        parser: 'typescript',
      });

      const indexPath = path.join(managedAssetDir, 'index.ts');
      await fsp.writeFile(indexPath, formattedFile);

      return indexPath;
    }),
  );

  console.log(
    `✨ Asset Manifests Generated!
  ${generatedFiles
    .map(filepath => path.relative(fsPath.project.resolve(), filepath))
    .join('\n  ')}`,
  );
}

generateAssetIndexes(fsPath.project.resolve('src', 'shared', 'assets')).catch(
  error => {
    console.error('❌ Error generating asset indexes:\n');
    console.error(error);
    process.exit(1);
  },
);
