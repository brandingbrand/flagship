import { parseTargetString, ProjectGraphProjectNode, TargetDependencyConfig } from '@nrwl/devkit';
import { createProjectGraphAsync } from '@nrwl/workspace/src/core/project-graph';
import { createTasksForProjectToRun } from 'nx/src/tasks-runner/run-command';

export async function calculateDependencies(
  targets: string[],
  targetDependencies?: Record<string, TargetDependencyConfig[]>
) {
  const projectGraph = await createProjectGraphAsync();

  const taskList = targets.flatMap((targetString) => {
    const { project, target, configuration } = parseTargetString(targetString);

    const tasks = createTasksForProjectToRun(
      [projectGraph.nodes[project] as ProjectGraphProjectNode],
      { target, configuration: configuration as string, overrides: {} },
      projectGraph,
      project,
      targetDependencies
    );

    // The last task in the list will always be the `targetString`
    // that is to be run, we are only interested in the dependencies
    // of that task as it relates to calculating the dependencies.
    const childTasks = tasks.slice(0, -1);
    return childTasks;
  });

  const dependencyList = new Set(taskList.map(({ id }) => id));
  return Array.from(dependencyList.keys());
}
