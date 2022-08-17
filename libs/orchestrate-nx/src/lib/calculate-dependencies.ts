import { parseTargetString } from '@nrwl/devkit';
import type { TargetDefaults, TargetDependencies } from 'nx/src/config/nx-json';
import { createProjectGraphAsync } from 'nx/src/project-graph/project-graph';
import { createTaskGraph } from 'nx/src/tasks-runner/create-task-graph';

const mergeTargetDependencies = (defaults?: TargetDefaults): TargetDependencies =>
  Object.fromEntries(
    Object.entries(defaults ?? {}).map(([key, { dependsOn }]) => [key, dependsOn ?? []])
  );

export const calculateDependencies = async (
  targets: string[],
  targetDependencies?: TargetDefaults
): Promise<string[]> => {
  const projectGraph = await createProjectGraphAsync();

  const taskList = targets.flatMap((targetString) => {
    const { configuration, project, target } = parseTargetString(targetString);

    const taskGraph = createTaskGraph(
      projectGraph,
      mergeTargetDependencies(targetDependencies),
      [project],
      [target],
      configuration,
      {}
    );

    // The last task in the list will always be the `targetString`
    // that is to be run, we are only interested in the dependencies
    // of that task as it relates to calculating the dependencies.
    // tasks.slice(0, -1)
    return taskGraph.dependencies[targetString] ?? [];
  });

  const dependencyList = new Set(taskList);
  return [...dependencyList.keys()];
};
