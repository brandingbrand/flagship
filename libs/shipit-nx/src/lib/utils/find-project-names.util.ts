import { ProjectConfiguration } from '@nrwl/devkit';
import { join } from 'path';
import { readJson } from './read-json.util';

type Workspace = { [projectName: string]: ProjectConfiguration };

export const findProjectNames = async (workspace: Workspace) => {
  return Promise.all(
    Object.entries(workspace).map(async ([name, { root, targets }]) => {
      const packageJsonPath = targets?.build?.options.packageJson ?? join(root, 'package.json');
      const packageJson = await readJson<{ name?: string }>(packageJsonPath).catch(() => {});

      return packageJson?.name ?? name;
    })
  );
};
