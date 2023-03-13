import type { List, Tree } from "../../../types/Yarn";

export const version = (packageName: string, json: List): string | undefined =>
  rVersion(packageName, json.data.trees);

const rVersion = (packageName: string, tree: Tree[]): string | undefined => {
  const rootDependency = tree.find((it) => it.name?.match(packageName));

  if (rootDependency) {
    return rootDependency.name
      ?.split("@")
      ?.find((it) => it.match(/[0-9]+?.[0-9]+?.[0-9]+?$/));
  }

  for (const leaf of tree) {
    if (leaf.children) {
      return rVersion(packageName, leaf.children);
    }
  }
};
