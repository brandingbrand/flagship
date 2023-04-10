import type { Dependencies, List } from "../../../types/Npm";

/**
 * Returns the version of a package in an Npm list object.
 *
 * @param {string} packageName - The name of the package to retrieve the version for.
 * @param {List} json - The Npm list object to search for the package.
 * @returns {string|undefined} - The version of the package, or undefined if it is not found.
 */
export const version = (packageName: string, json: List): string | undefined =>
  rVersion(packageName, json.dependencies);

/**
 * Helper function to recursively search for a package in the dependencies object.
 *
 * @param {string} packageName - The name of the package to retrieve the version for.
 * @param {Dependencies} dependencies - The dependencies object to search for the package.
 * @returns {string|undefined} - The version of the package, or undefined if it is not found.
 */
export const rVersion = (
  packageName: string,
  dependencies: Dependencies
): string | undefined => {
  const entries = Object.entries(dependencies);

  const rootDependency = entries.find(([key]) => key === packageName);

  if (rootDependency) {
    return rootDependency[1].version;
  }

  for (const entry of entries) {
    const [, value] = entry;

    if (value.dependencies) {
      return rVersion(packageName, value.dependencies);
    }
  }
};
