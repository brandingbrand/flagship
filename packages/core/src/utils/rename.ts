import fs from "fs-extra";
import { sync } from "glob";

import * as path from "./path";
import { logInfo } from "./logger";

const getMatchingFiles = (directory: string, oldName: string): string[] => {
  const globOptions = {
    nosort: true,
    dot: true,
  };

  // Find files/directories to be renamed
  const results = [
    ...sync(`${directory}/**/*${oldName}*`, globOptions),
    ...sync(`${directory}/**/*${oldName.toLocaleLowerCase()}*`, globOptions),
  ];

  // Remove duplicate paths from the results array
  const uniqueResults = [...new Set(results)];

  // Sort the results so highest depth paths are replaced first
  uniqueResults.sort((a, b) => b.length - a.length);

  return uniqueResults;
};

/**
 * Updates the directory structure to match a new namespace
 *
 * @param oldPkg The old package name to replace.
 * @param newPkg The new package name to use.
 * @param pathComponents Path components to the directory in which to
 * replace the project name.
 */
export const pkgDirectory = async (
  oldPkg: string,
  newPkg: string,
  ...pathComponents: string[]
): Promise<void> => {
  const directory = path.project.resolve(...pathComponents);
  const oldPathPart = oldPkg.replace(/\./g, "/");
  const newPathPart = newPkg.replace(/\./g, "/");

  const results = getMatchingFiles(directory, oldPathPart);

  // Rename matching paths
  for (const oldPath of results) {
    const newPath = oldPath.replace(oldPathPart, newPathPart);
    await fs.move(oldPath, newPath);
  }

  // since we only moved the bottom-most directory, traverse through the old
  // package directories to delete any empty package folders
  for (const dir of oldPkg
    .split(".")
    .reduce<string[]>((parts, part, index, arr) => {
      const pattern = [...arr.slice(0, index), part].join("/");
      parts.push(...getMatchingFiles(directory, pattern));
      return parts;
    }, [])
    .reverse()) {
    const contents = (await fs.pathExists(dir)) && (await fs.readdir(dir));
    if (Array.isArray(contents) && contents.length === 0) {
      await fs.remove(dir);
    }
  }
  logInfo(`renamed project files in ${directory}`);
};
