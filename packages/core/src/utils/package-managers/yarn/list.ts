import type { List, Tree } from "../../../types/Yarn";

/**
 * Returns the version of a given package in a Yarn lock file.
 *
 * @param {string} packageName - The name of the package to search for.
 * @param {List} json - The parsed Yarn lock file in JSON format.
 * @returns {string|undefined} - The version of the package or undefined if not found.
 */
export const version = (packageName: string, json: List): string | undefined =>
  rVersion(packageName, json.data.trees);

/**
 * Recursively searches the tree for the given package and returns its version.
 *
 * @param {string} packageName - The name of the package to search for.
 * @param {Tree[]} tree - The current level of the tree to search in.
 * @returns {string|undefined} - The version of the package or undefined if not found.
 */
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
