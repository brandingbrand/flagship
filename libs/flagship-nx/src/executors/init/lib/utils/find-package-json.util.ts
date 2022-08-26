import type { Tree } from '@nrwl/devkit';
import { joinPathFragments, readCachedProjectGraph, readJson } from '@nrwl/devkit';
import type { TsConfigJson } from 'type-fest';

export const findPackageJson = (tree: Tree, packageName: string): string => {
  const projectGraph = readCachedProjectGraph();
  const tsconfig = readJson<TsConfigJson>(tree, 'tsconfig.base.json');
  if (packageName in (tsconfig.compilerOptions?.paths ?? {})) {
    const entryPoints = tsconfig.compilerOptions?.paths?.[packageName];
    const project = Object.values(projectGraph.nodes).find(({ data }) =>
      entryPoints?.some(
        (entryPoint) => data.sourceRoot !== undefined && entryPoint.startsWith(data.sourceRoot)
      )
    );

    if (project) {
      return joinPathFragments(project.data.root, 'package.json');
    }
  }

  return require.resolve(joinPathFragments(packageName, 'package.json'));
};
