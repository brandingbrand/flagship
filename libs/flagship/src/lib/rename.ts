import { sync } from 'glob';

import { logError, logInfo } from '../helpers';

import * as fs from './fs';
import * as path from './path';

const replace = require('replace-in-file');

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
 * Replaces the project name within the boilerplate source files.
 *
 * @param oldName The old project name to replace.
 * @param newName The new project name to use.
 * @param pathComponents Path components to the directory in which to
 * replace the project name.
 */
export const source = (oldName: string, newName: string, ...pathComponents: string[]): void => {
  const directory = path.project.resolve(...pathComponents);

  // Since we're using a 3rd party library to do the replace glob, ensure our disc is in sync
  // with our in-memory cache.
  fs.flushSync();

  try {
    replace.sync({
      files: `${directory}/**/*`,
      ignore: `${directory}/Pods/**/*`,
      from: [new RegExp(oldName, 'g'), new RegExp(oldName.toLocaleLowerCase(), 'g')],
      to: [newName, newName.toLocaleLowerCase()],
      glob: { dot: true },
    });
  } catch (error: any) {
    logError(`renaming project within source`, error);
    process.exit(1);
  }

  logInfo(`renamed project within source in ${directory}`);
};

/**
 * Updates the directory structure to match a new namespace
 *
 * @param oldPkg The old package name to replace.
 * @param newPkg The new package name to use.
 * @param pathComponents Path components to the directory in which to
 * replace the project name.
 */
export const pkgDirectory = (oldPkg: string, newPkg: string, ...pathComponents: string[]): void => {
  const directory = path.project.resolve(...pathComponents);
  const oldPathPart = oldPkg.replace(/\./g, '/');
  const newPathPart = newPkg.replace(/\./g, '/');

  try {
    const results = getMatchingFiles(directory, oldPathPart);

    // Rename matching paths
    for (const oldPath of results) {
      const newPath = oldPath.replace(oldPathPart, newPathPart);
      fs.moveSync(oldPath, newPath);
    }

    // since we only moved the bottom-most directory, traverse through the old
    // package directories to delete any empty package folders
    for (const dir of oldPkg
      .split('.')
      .reduce<string[]>((parts, part, index, arr) => {
        const pattern = [...arr.slice(0, index), part].join('/');
        parts.push(...getMatchingFiles(directory, pattern));
        return parts;
      }, [])
      .reverse()) {
      const contents = fs.pathExistsSync(dir) && fs.readdirSync(dir);
      if (Array.isArray(contents) && contents.length === 0) {
        fs.removeSync(dir);
      }
    }
  } catch (error: any) {
    logError('renaming project files', error);
    process.exit(1);
  }

  logInfo(`renamed project files in ${directory}`);
};

/**
 * Replaces the project name within boilerplate file names.
 *
 * @param oldName The old project name to replace.
 * @param newName The new project name to use.
 * @param pathComponents Path components to the directory in which to
 * replace the project name.
 */
export const files = (oldName: string, newName: string, ...pathComponents: string[]): void => {
  const directory = path.project.resolve(...pathComponents);

  try {
    const results = getMatchingFiles(directory, oldName);

    // Rename each path
    for (const oldPath of results) {
      // Only replace the final occurence in the path
      let newPath: any = oldPath.split('/');
      const n = newPath.length - 1;
      newPath[n] = newPath[n]
        .replace(oldName, newName)
        .replace(oldName.toLocaleLowerCase(), newName.toLocaleLowerCase());
      newPath = newPath.join('/');

      fs.moveSync(oldPath, newPath);
    }
  } catch (error: any) {
    logError('renaming project files', error);
    process.exit(1);
  }

  logInfo(`renamed project files in ${directory}`);
};
