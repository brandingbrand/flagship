const replace = require('replace-in-file');
import { sync } from 'glob';
import * as fs from './fs';
import * as path from './path';
import {
  logError,
  logInfo
} from '../helpers';

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
      glob: { dot: true }
    });
  } catch (err) {
    logError(`renaming project within source`, err);
    process.exit(1);
  }

  logInfo(`renamed project within source in ${directory}`);
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
    const globOptions = {
      nosort: true,
      dot: true
    };

    // Find files/directories to be renamed
    const results = [
      ...sync(directory + '/**/*' + oldName + '*', globOptions),
      ...sync(directory + '/**/*' + oldName.toLocaleLowerCase() + '*', globOptions)
    ];

    // Sort the results so highest depth paths are replaced first
    results.sort((a, b) => {
      return b.length - a.length;
    });

    // Rename each path
    results.forEach(oldPath => {
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

  logInfo(`renaming project files in ${directory}`);
}
