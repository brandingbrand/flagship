import type { Dependencies, List } from "../../../types/Npm";

export const version = (packageName: string, json: List): string | undefined =>
  rVersion(packageName, json.dependencies);

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
