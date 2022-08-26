import type { Tree } from '@nrwl/devkit';
import { flushChanges } from 'nx/src/generators/tree';

interface OpenTree {
  recordedChanges: object;
}

export const flushTree = (tree: Tree): void => {
  flushChanges(tree.root, tree.listChanges());
  // Really you shouldn't be accessing the recordedChanges
  // as it is a private property, but in order to reset the
  // tree so that is actually flushed it needs to be cleared
  (tree as unknown as OpenTree).recordedChanges = {};
};
