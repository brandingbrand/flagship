import type { ProjectConfiguration, Tree } from '@nrwl/devkit';
import { readProjectConfiguration, updateProjectConfiguration } from '@nrwl/devkit';

import { mergeDeep } from './merge-deep.util';

export const mergeProjectConfiguration = (
  tree: Tree,
  projectName: string,
  configuration: Partial<ProjectConfiguration>
): void => {
  const existingConfiguration = readProjectConfiguration(tree, projectName);
  const mergedConfiguration = mergeDeep(existingConfiguration, configuration);
  updateProjectConfiguration(tree, projectName, mergedConfiguration);
};
