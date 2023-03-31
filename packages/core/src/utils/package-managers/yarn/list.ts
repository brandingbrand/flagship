import type { List, Tree } from "../../../types/Yarn";

export const version = (packageName: string, json: List): string | undefined =>
  rVersion(packageName, json.data.trees);

const rVersion = (packageName: string, tree: Tree[]): string | undefined => {
  const rootDependency = tree.find((it) => it.name?.match(packageName));

  if (rootDependency) {
    return rootDependency.name
      ?.split("@")
      ?.find((it) =>
        it.match(
          /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm
        )
      );
  }

  for (const leaf of tree) {
    if (leaf.children) {
      return rVersion(packageName, leaf.children);
    }
  }
};
