import { parseTargetString, Task } from '@nrwl/devkit';
import { createProjectGraphAsync } from '@nrwl/workspace/src/core/project-graph';
import { createTasksForProjectToRun } from '@nrwl/workspace/src/tasks-runner/run-command';

export async function calculateDependencies(targets: string[]) {
  const projectGraph = await createProjectGraphAsync();
  const taskList = targets.map((targetString) => {
    const { project, target, configuration } = parseTargetString(targetString);

    return createTasksForProjectToRun(
      [projectGraph.nodes[project]],
      { target, configuration: configuration as string, overrides: {} },
      projectGraph,
      project
    );
  });

  const dependencyList = taskList.reduce((aggregate, list) => {
    const dependencies = list.slice(0, -1);
    for (const dependency of dependencies) {
      aggregate.set(dependency.id, dependency);
    }

    return aggregate;
  }, new Map<string, Task>());

  return Array.from(dependencyList.keys());
}
