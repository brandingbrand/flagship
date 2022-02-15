import { ProjectConfiguration, ProjectGraph, readJson, Tree } from '@nrwl/devkit';

import { join } from 'path';

export const findDependencies = async (
  tree: Tree,
  graph: ProjectGraph,
  originalProjectName: string
): Promise<Set<string>> => {
  // eslint-disable-next-line complexity
  const internalFindDependencies = async (
    projectName: string,
    list = new Set<string>(),
    seen = new Set<string>()
  ) => {
    // In case of bad circular dependencies
    if (seen.has(projectName)) {
      return list;
    }
    seen.add(projectName);

    const npmNode = graph.externalNodes?.[projectName];

    if (npmNode) {
      // Ignore references that are only in package.json
      const isSourceDependency = graph.allWorkspaceFiles
        ?.filter(({ file }) => file.startsWith(graph.nodes[originalProjectName].data.root))
        .filter(
          ({ file }) => file !== join(graph.nodes[originalProjectName].data.root, 'package.json')
        )
        .some(({ deps }) => deps?.some(({ projectName }) => projectName === npmNode.name));

      if (isSourceDependency) {
        list.add(npmNode.data.packageName);
      }
    } else {
      const project = graph.nodes[projectName];
      if (project.type === 'lib') {
        const packageJson =
          project.data?.targets?.build?.options?.packageJson ??
          join(project.data.root, 'package.json');

        const { name } = readJson<{ name?: string }>(tree, packageJson);

        if (name) {
          list.add(name);
        }
      }

      for (const dep of graph.dependencies[projectName] ?? []) {
        await internalFindDependencies(dep.target, list, seen);
      }
    }

    return list;
  };

  const projectJson = readJson<ProjectConfiguration>(
    tree,
    join(graph.nodes[originalProjectName].data.root, 'project.json')
  );

  const dependencies = await internalFindDependencies(originalProjectName);

  const executors = Object.values(projectJson.targets ?? {})
    .map(({ executor }) => executor.split(':'))
    .map(([packageName]) => packageName);

  const webpackConfigs = Object.values(projectJson.targets ?? {})
    .flatMap(({ options, configurations }) => [
      options?.webpackConfig,
      ...Object.values(configurations ?? {}).map(({ webpackConfig }) => webpackConfig),
    ])
    .filter((config) => config && !config.startsWith('.'));

  for (const packageName of [...executors, ...webpackConfigs]) {
    dependencies.add(packageName);
  }

  return dependencies;
};
