const replace = require('replace-in-file');
import { sync } from 'glob';
import * as fs from './fs';
import * as path from './path';
import { logError, logInfo } from '../helpers';

/**
 * Replaces the project name within the boilerplate source files.
 *
 * @param {string} oldName The old project name to replace.
 * @param {string} newName The new project name to use.
 * @param {...string} pathComponents Path components to the directory in which to
 * replace the project name.
 */
export function source(oldName: string, newName: string, ...pathComponents: string[]): void {
  const directory = path.project.resolve(...pathComponents);

  try {
    replace.sync({
      files: directory + '/**/*',
      ignore: directory + '/Pods/**/*',
      from: [new RegExp(oldName, 'g'), new RegExp(oldName.toLocaleLowerCase(), 'g')],
      to: [newName, newName.toLocaleLowerCase()],
      glob: { dot: true },
    });
  } catch (err) {
    logError(`renaming project within source`, err);
    process.exit(1);
  }

  logInfo(`renamed project within source in ${directory}`);
}

/**
 * Updates the directory structure to match a new namespace
 *
 * @param {string} oldPkg The old package name to replace.
 * @param {string} newPkg The new package name to use.
 * @param {...string} pathComponents Path components to the directory in which to
 * replace the project name.
 */
export function pkgDirectory(oldPkg: string, newPkg: string, ...pathComponents: string[]): void {
  const directory = path.project.resolve(...pathComponents);
  const oldPathPart = oldPkg.replace(/\./g, '/');
  const newPathPart = newPkg.replace(/\./g, '/');

  try {
    const results = getMatchingFiles(directory, oldPathPart);

    // Rename matching paths
    results.forEach((oldPath) => {
      const newPath = oldPath.replace(oldPathPart, newPathPart);
      fs.moveSync(oldPath, newPath);
    });

    // since we only moved the bottom-most directory, traverse through the old
    // package directories to delete any empty package folders
    oldPkg
      .split('.')
      .reduce<string[]>((parts, part, index, arr) => {
        const pattern = [...arr.slice(0, index), part].join('/');
        parts.push(...getMatchingFiles(directory, pattern));
        return parts;
      }, [])
      .reverse()
      .forEach((dir) => {
        const contents = fs.pathExistsSync(dir) && fs.readdirSync(dir);
        if (Array.isArray(contents) && contents.length === 0) {
          fs.removeSync(dir);
        }
      });
  } catch (err) {
    logError('renaming project files', err);
    process.exit(1);
  }

  logInfo(`renamed project files in ${directory}`);
}

/**
 * Replaces the project name within boilerplate file names.
 *
 * @param {string} oldName The old project name to replace.
 * @param {string} newName The new project name to use.
 * @param {...string} pathComponents Path components to the directory in which to
 * replace the project name.
 */
export function files(oldName: string, newName: string, ...pathComponents: string[]): void {
  const directory = path.project.resolve(...pathComponents);

  try {
    const results = getMatchingFiles(directory, oldName);

    // Rename each path
    results.forEach((oldPath) => {
      // Only replace the final occurence in the path
      let newPath: any = oldPath.split('/');
      const n = newPath.length - 1;
      newPath[n] = newPath[n]
        .replace(oldName, newName)
        .replace(oldName.toLocaleLowerCase(), newName.toLocaleLowerCase());
      newPath = newPath.join('/');

      fs.renameSync(oldPath, newPath);
    });
  } catch (err) {
    logError('renaming project files', err);
    process.exit(1);
  }

  logInfo(`renamed project files in ${directory}`);
}

function getMatchingFiles(directory: string, oldName: string): string[] {
  const globOptions = {
    nosort: true,
    dot: true,
  };

  // Find files/directories to be renamed
  const results = [
    ...sync(directory + '/**/*' + oldName + '*', globOptions),
    ...sync(directory + '/**/*' + oldName.toLocaleLowerCase() + '*', globOptions),
  ];

  // Remove duplicate paths from the results array
  const uniqueResults = Array.from(new Set(results));

  // Sort the results so highest depth paths are replaced first
  uniqueResults.sort((a, b) => {
    return b.length - a.length;
  });

  return uniqueResults;
}
