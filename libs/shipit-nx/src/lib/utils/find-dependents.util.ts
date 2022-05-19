import type { ProjectGraph } from '@nrwl/devkit';

export const findDependents = async (
  graph: ProjectGraph,
  projectName: string,
  list = new Set<string>(),
  seen = new Set<string>()
): Promise<Set<string>> => {
  // In case of bad circular dependencies
  if (seen.has(projectName)) {
    return list;
  }
  seen.add(projectName);

  const otherProjects = Object.entries(graph.nodes)
    .filter(([project]) => project !== projectName)
    .filter(([project]) =>
      graph.dependencies[project]?.some(({ target }) => target === projectName)
    );

  for (const [otherProject] of otherProjects) {
    const node = graph.nodes[otherProject];

    if (node) {
      list.add(node.name);
    }

    for (const dep of graph.dependencies[otherProject] ?? []) {
      if (!dep.target.startsWith('npm:')) {
        await findDependents(graph, dep.target, list, seen);
      }
    }
  }

  return list;
};
