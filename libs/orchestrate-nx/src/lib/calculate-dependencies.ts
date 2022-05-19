import type { ProjectGraphProjectNode, TargetDependencyConfig } from '@nrwl/devkit';
import { parseTargetString } from '@nrwl/devkit';
import { createProjectGraphAsync } from '@nrwl/workspace/src/core/project-graph';
import { createTasksForProjectToRun } from 'nx/src/tasks-runner/run-command';

export const calculateDependencies = async (
  targets: string[],
  targetDependencies?: Record<string, TargetDependencyConfig[]>
): Promise<string[]> => {
  const projectGraph = await createProjectGraphAsync();

  const taskList = targets.flatMap((targetString) => {
    const { configuration, project, target } = parseTargetString(targetString);

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
    return tasks.slice(0, -1);
  });

  const dependencyList = new Set(taskList.map(({ id }) => id));
  return [...dependencyList.keys()];
};
