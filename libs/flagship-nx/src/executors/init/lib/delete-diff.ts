import { Tree } from '@nrwl/devkit';
import { join } from 'path';

export const deleteDiff = (tree: Tree, from: string, to: string): void => {
  if (tree.isFile(to)) {
    if (!tree.exists(from)) {
      tree.delete(to);
    }

    return;
  }

  for (const child of tree.children(to)) {
    deleteDiff(tree, join(from, child), join(to, child));
  }
};
