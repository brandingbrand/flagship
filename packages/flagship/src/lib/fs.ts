import {
  copySync,
  ensureDirSync,
  ensureSymlinkSync,
  moveSync,
  pathExistsSync,
  readdirSync,
  readFileSync,
  removeSync,
  renameSync,
  writeFileSync
} from 'fs-extra';
export {
  copySync,
  removeSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  ensureDirSync,
  renameSync,
  pathExistsSync,
  ensureSymlinkSync,
  moveSync
};

import * as helpers from '../helpers';
import * as path from './path';

/**
 * Clones a named resource from within FLAGSHIP into the project.
 *
 * @param {...string} resource A list of path components to the resource to copy.
 */
export function clone(...resource: string[]): void {
  const source = path.flagship.resolve(...resource);
  const destination = path.project.resolve(...resource);

  helpers.logInfo(
    `cloning ${helpers.colors.Dim}${source}${helpers.colors.Reset} => ` +
    `${helpers.colors.Dim}${destination}${helpers.colors.Reset}`
  );

  copySync(source, destination);
}

/**
 * Updates a file, replacing a given string with a new one.
 *
 * @param {string} path The path to the file to update.
 * @param {string} oldText The old text to replace.
 * @param {string} newText The replacement text.
 */
export function update(path: string, oldText: string | RegExp, newText: string): void {
  // TODO: This should use a streaming buffer

  if (!doesKeywordExist(path, oldText)) {
    return helpers.logError(`Couldn't find ${oldText} in ${path}`);
  }

  const fileContent = readFileSync(path, { encoding: 'utf8' });

  helpers.logInfo(`updating ${helpers.colors.Dim}${path}${helpers.colors.Reset}`);
  writeFileSync(path, fileContent.replace(oldText, newText));
}

/**
 * Checks if a keyword exists in a file.
 *
 * @param {string} path The path to the file to check for the keyword.
 * @param {string} keyword The keyword to search for in the file
 * @returns {boolean} True if the keyword exists in the file.
 */
export function doesKeywordExist(path: string, keyword: string | RegExp): boolean {
  // TODO: This should use a streaming buffer
  const fileContent = readFileSync(path, { encoding: 'utf8' });
  if (typeof keyword === 'string') {
    return fileContent.indexOf(keyword) > -1;
  } else {
    return keyword.test(fileContent);
  }
}
