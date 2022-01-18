import { Tree } from '@nrwl/devkit';
import { join } from 'path';

export const writeRecursive = (tree: Tree, from: string, to: string): void => {
  if (tree.isFile(from)) {
    tree.write(to, tree.read(from) as Buffer);
    return;
  }

  for (const child of tree.children(from)) {
    writeRecursive(tree, join(from, child), join(to, child));
  }
};
