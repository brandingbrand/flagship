import { Dictionary } from '@brandingbrand/fsfoundation';

import * as fs from 'fs-extra';
import * as helpers from '../helpers';
import * as path from './path';

export {
  ensureDirSync,
  ensureFileSync,
  ensureSymlinkSync,
  pathExistsSync,
  readdirSync
} from 'fs-extra';

let fileQueue: Dictionary<{ body: string; dirty?: (code: number) => void }> = {};


/**
 * Clones a named resource from within FLAGSHIP into the project.
 *
 * @param {...string} resource A list of path components to the resource to copy.
 * @returns {void}
 */
export function clone(...resource: string[]): void {
  const source = path.flagship.resolve(...resource);
  const destination = path.project.resolve(...resource);

  helpers.logInfo(
    `cloning ${helpers.colors.Dim}${source}${helpers.colors.Reset} => ` +
    `${helpers.colors.Dim}${destination}${helpers.colors.Reset}`
  );

  if (fileQueue[source]) {
    writeFileSync(destination, fileQueue[source].body);
  } else {
    copySync(source, destination);
  }
}

/**
 * Copy a file or directory. The directory can have contents.
 *
 *  @param {string} src Note that if src is a directory it will copy everything inside of this
 *  directory, not the entire directory itself.
 *  @param {string} dest Note that if src is a file, dest cannot be a directory.
 *  @param {Object} options fs-extra copySync options.
 *  @returns {void}
 */
export function copySync(src: string, dest: string, options?: Object): void {
  // TODO: Use fs-extra type definition for options instead of Object
  src = path.resolve(src);

  if (fs.existsSync(src)) {
    const stat = fs.lstatSync(src);

    if (stat.isDirectory()) {
      // TODO: Traverse the directory and see if we have any cached files and move them instead of
      // flushing the cache.
      flushSync();
      return fs.copySync(src, dest, options);
    } else if (stat.isFile()) {
      if (fileQueue[src]) {
        return writeFileSync(dest, fileQueue[src].body);
      }
    }
  }

  // Source doesn't exist or isn't in the queue
  return fs.copySync(src, dest, options);
}

/**
 * Checks if a keyword exists in a file.
 *
 * @param {string} path The path to the file to check for the keyword.
 * @param {string} keyword The keyword to search for in the file
 * @returns {boolean} True if the keyword exists in the file.
 */
export function doesKeywordExist(path: string, keyword: string | RegExp): boolean {
  const fileContent = readFileSync(path);
  if (typeof keyword === 'string') {
    return fileContent.indexOf(keyword) > -1;
  } else {
    return keyword.test(fileContent);
  }
}

/**
 * Returns whether or not the given path exists.
 *
 * @param {string} src The path to check whether or not it exists.
 * @returns {boolean} Whether or not the path exists.
 */
export function existsSync(src: string): boolean {
  src = path.resolve(src);

  return !!fileQueue[src] || fs.existsSync(src);
}

/**
 * Flushes all pending writes in the write queue and purges the cache. This will bring the
 * filesystem into a consistent state with the deferred actions so it should be invoked minimally,
 * but before anything that interacts with the filesystem outside of this library is allowed to
 * execute.
 * @returns {void}
 */
export function flushSync(): void {
  for (const name in fileQueue) {
    if (fileQueue.hasOwnProperty(name)) {
      const file = fileQueue[name];

      if (file.dirty) {
        fs.writeFileSync(name, file.body);

        process.removeListener('beforeExit', file.dirty);
        delete file.dirty;
      }
    }
  }

  fileQueue = {};
}

/**
 * Moves a file or directory, even across devices.
 *
 * @param {string} src The file or directory to move
 * @param {string} dest The destination for the file or directory
 * @returns {void}
 */
export function moveSync(src: string, dest: string): void {
  src = path.resolve(src);
  dest = path.resolve(dest);

  if (fs.existsSync(src)) {
    const stat = fs.lstatSync(src);

    if (stat.isDirectory()) {
      // TODO: Traverse the directory and see if we have any cached files and move them instead of
      // flushing the cache
      flushSync();
      return fs.moveSync(src, dest);
    } else if (stat.isFile()) {
      const file = fileQueue[src];

      if (file) {
        writeFileSync(dest, file.body);

        if (file.dirty) {
          process.removeListener('beforeExit', file.dirty);
          delete fileQueue[src];
        }

        fs.removeSync(src);
        return;
      }
    }
  }

  // Source doesn't exist or isn't in the queue
  return fs.moveSync(src, dest);
}

/**
 * Synchronously reads in the file at the given path and caches the contents in-memory.
 *
 * @param {string} src The path of the file to read.
 * @returns {string} The contents of the file.
 */
export function readFileSync(src: string): string {
  const name = path.resolve(src);

  return fileQueue[name]?.body || (fileQueue[name] = {
    body: fs.readFileSync(name, { encoding: 'utf8' })
  }).body;
}

/**
 * Synchronously removes a file from a given path.
 *
 * @param {string} src The path to remove.
 * @returns {void}
 */
export function removeSync(src: string): void {
  const name = path.resolve(src);
  let file = fileQueue[name];

  if (file) {
    if (file.dirty) {
      process.removeListener('beforeExit', file.dirty);
    }

    delete fileQueue[name];
  } else {
    // Check if this is a parent directory of any cached files
    for (const cached in fileQueue) {
      if (cached.startsWith(name)) {
        file = fileQueue[cached];

        if (file.dirty) {
          process.removeListener('beforeExit', file.dirty);
        }

        delete fileQueue[cached];
      }
    }
  }

  fs.removeSync(src);
}

/**
 * Updates a file, replacing a given string with a new one.
 *
 * @param {string} path The path to the file to update.
 * @param {string} oldText The old text to replace.
 * @param {string} newText The replacement text.
 * @returns {void}
 */
export function update(path: string, oldText: string | RegExp, newText: string): void {
  if (!doesKeywordExist(path, oldText)) {
    return helpers.logError(`Couldn't find ${oldText} in ${path}`);
  }

  const fileContent = readFileSync(path);

  helpers.logInfo(`updating ${helpers.colors.Dim}${path}${helpers.colors.Reset}`);
  writeFileSync(path, fileContent.replace(oldText, newText));
}

/**
 * Updates the cached version of given file and schedules the file to be written to disk before
 * the process exits.
 *
 * @param {string} dest The path of the file to write.
 * @param {string} body The new body of the file.
 * @returns {void}
 */
export function writeFileSync(dest: string, body: string): void {
  const name = path.resolve(dest);
  let file = fileQueue[name];

  if (!file) {
    file = (fileQueue[name] = { body });
  } else {
    file.body = body;
  }

  if (!file.dirty) {
    file.dirty = code => {
      // Only commit the file to disk if the process is exiting successfully.
      if (0 === code) {
        fs.writeFile(name, file.body, (err: Error) => {
          if (err) {
            helpers.logError(`Error saving file ${name}`, err.toString());
          }

          delete file.dirty;
        });
      }
    };

    // Schedule the file to be written before the process closes.
    process.once('beforeExit', file.dirty);
  }
}
