import * as fs from 'fs';
import path from 'path';

import * as t from '@babel/types';
import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import {glob} from 'glob';
import {BuildConfig, logger} from '@brandingbrand/code-cli-kit';
import {Node} from '@babel/types';

import {bundleRequire} from '@/utils/bundleRequire';

export async function findBuildConfigFiles(
  rootDir: string,
  build: string,
): Promise<BuildConfig> {
  const checkForDefineBuildImport = (
    fileContent: string,
  ): {hasDefineBuild: boolean; importLine?: number} => {
    let hasDefineBuild = false;
    let importLine: number | undefined;

    try {
      // Cast the parse result to Node to ensure type compatibility
      const ast = parse(fileContent, {
        sourceType: 'module',
        plugins: ['typescript'],
      }) as unknown as Node;

      traverse(ast, {
        ImportDeclaration(path) {
          const node = path.node;

          if (node.source.value === '@brandingbrand/code-cli-kit') {
            node.specifiers.forEach(specifier => {
              if (
                t.isImportSpecifier(specifier) &&
                t.isIdentifier(specifier.imported) &&
                specifier.imported.name === 'defineBuild'
              ) {
                hasDefineBuild = true;
                importLine = node.loc?.start.line;
              }
            });
          }
        },
      });
    } catch (error) {
      console.error(`Error parsing file: ${error}`);
      return {hasDefineBuild: false};
    }

    return {hasDefineBuild, importLine};
  };

  const pattern = path.join(rootDir, '**/build.*.ts');
  try {
    const files = await glob(pattern, {ignore: ['**/node_modules/**']});
    logger.log(
      `Found ${files.length} build configurations: ${files.join(', ')}`,
    );

    const buildFile = files.find(filePath => {
      const fileName = path.basename(filePath);
      const buildConfig = fileName.replace(/^build\.(.+)\.ts$/, '$1');

      if (buildConfig !== build) return false;

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const {hasDefineBuild, importLine} =
        checkForDefineBuildImport(fileContent);

      return hasDefineBuild && importLine;
    });

    if (!buildFile) {
      throw Error(build);
    }

    const buildConfig = await bundleRequire<BuildConfig>(buildFile);

    return buildConfig;
  } catch (error) {
    throw new Error(`Failed to find build config files: ${error}`);
  }
}
