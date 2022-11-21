/* eslint-disable no-prototype-builtins */
import ejs from "ejs";
import fs from "fs-extra";
import nodePath from "path";

import * as path from "./path";
import * as helpers from "./logger";

export * from "fs-extra";

let fileQueue: Record<
  string,
  { body: string; dirty?: (code: number) => void }
> = {};

/**
 * Copy a file or directory. The directory can have contents.
 *
 * @param src Note that if src is a directory it will copy everything inside of this
 *  directory, not the entire directory itself.
 * @param dest Note that if src is a file, dest cannot be a directory.
 * @param options fs-extra copySync options.
 * @return
 */
export const copySync = (src: string, dest: string, options?: never): void => {
  // TODO: Use fs-extra type definition for options instead of Object
  src = path.resolve(src);

  if (fs.existsSync(src)) {
    const stat = fs.lstatSync(src);

    if (stat.isDirectory()) {
      // TODO: Traverse the directory and see if we have any cached files and move them instead of
      // flushing the cache.
      flushSync();
      fs.copySync(src, dest, options);
      return;
    } else if (stat.isFile() && fileQueue[src]) {
      writeFileSync(dest, fileQueue[src]?.body ?? "");
      return;
    }
  }

  // Source doesn't exist or isn't in the queue
  fs.copySync(src, dest, options);
};

/**
 * Checks if a keyword exists in a file.
 *
 * @param path The path to the file to check for the keyword.
 * @param keyword The keyword to search for in the file
 * @return True if the keyword exists in the file.
 */
export const doesKeywordExist = (
  path: string,
  keyword: RegExp | string
): boolean => {
  const fileContent = readFileSync(path);
  if (typeof keyword === "string") {
    return fileContent.includes(keyword);
  }
  return keyword.test(fileContent);
};

/**
 * Returns whether or not the given path exists.
 *
 * @param src The path to check whether or not it exists.
 * @return Whether or not the path exists.
 */
export const existsSync = (src: string): boolean => {
  src = path.resolve(src);

  return Boolean(fileQueue[src]) || fs.existsSync(src);
};

/**
 * Flushes all pending writes in the write queue and purges the cache. This will bring the
 * filesystem into a consistent state with the deferred actions so it should be invoked minimally,
 * but before anything that interacts with the filesystem outside of this library is allowed to
 * execute.
 *
 * @return
 */
export const flushSync = (): void => {
  for (const name in fileQueue) {
    if (fileQueue.hasOwnProperty(name)) {
      const file = fileQueue[name];

      if (file?.dirty) {
        fs.writeFileSync(name, file.body);

        process.removeListener("beforeExit", file.dirty);
        delete file.dirty;
      }
    }
  }

  fileQueue = {};
};

/**
 * Moves a file or directory, even across devices.
 *
 * @param src The file or directory to move
 * @param dest The destination for the file or directory
 * @return
 */
export const moveSync = (src: string, dest: string): void => {
  src = path.resolve(src);
  dest = path.resolve(dest);

  if (fs.existsSync(src)) {
    const stat = fs.lstatSync(src);

    if (stat.isDirectory()) {
      // TODO: Traverse the directory and see if we have any cached files and move them instead of
      // flushing the cache
      flushSync();
      fs.moveSync(src, dest);
      return;
    } else if (stat.isFile()) {
      const file = fileQueue[src];

      if (file) {
        writeFileSync(dest, file.body);

        if (file.dirty) {
          process.removeListener("beforeExit", file.dirty);
          delete fileQueue[src];
        }

        fs.removeSync(src);
        return;
      }
    }
  }

  // Source doesn't exist or isn't in the queue
  fs.moveSync(src, dest);
};

/**
 * Synchronously reads in the file at the given path and caches the contents in-memory.
 *
 * @param src The path of the file to read.
 * @return The contents of the file.
 */
export const readFileSync = (src: string): string => {
  const name = path.resolve(src);

  return (
    fileQueue[name]?.body ||
    (fileQueue[name] = {
      body: fs.readFileSync(name, { encoding: "utf8" }),
    }).body
  );
};

/**
 * Synchronously removes a file from a given path.
 *
 * @param src The path to remove.
 * @return
 */
export const removeSync = (src: string): void => {
  const name = path.resolve(src);
  let file = fileQueue[name];

  if (file) {
    if (file.dirty) {
      process.removeListener("beforeExit", file.dirty);
    }

    delete fileQueue[name];
  } else {
    // Check if this is a parent directory of any cached files
    for (const cached in fileQueue) {
      if (cached.startsWith(name)) {
        file = fileQueue[cached];

        if (file?.dirty) {
          process.removeListener("beforeExit", file.dirty);
        }

        delete fileQueue[cached];
      }
    }
  }

  fs.removeSync(src);
};

/**
 * Updates a file, replacing a given string with a new one.
 *
 * @param path The path to the file to update.
 * @param oldText The old text to replace.
 * @param newText The replacement text.
 * @return
 */
export const update = (
  path: string,
  oldText: RegExp | string,
  newText: string
): void => {
  // TODO: This should use a streaming buffer

  if (!doesKeywordExist(path, oldText)) {
    helpers.logError(`Couldn't find ${oldText} in ${path}`);
    return;
  }

  const fileContent = readFileSync(path);

  helpers.logInfo(
    `updating ${helpers.colors.Dim}${path}${helpers.colors.Reset}`
  );
  writeFileSync(path, fileContent.replace(oldText, newText));
};

/**
 * Updates the cached version of given file and schedules the file to be written to disk before
 * the process exits.
 *
 * @param dest The path of the file to write.
 * @param body The new body of the file.
 * @return
 */
export const writeFileSync = (dest: string, body: string): void => {
  const name = path.resolve(dest);
  let file = fileQueue[name];

  if (!file) {
    file = fileQueue[name] = { body };
  } else {
    file.body = body;
  }

  if (!file.dirty) {
    file.dirty = (code) => {
      // Only commit the file to disk if the process is exiting successfully.
      if (0 === code) {
        fs.writeFile(name, file?.body, (err: Error) => {
          if (err) {
            helpers.logError(`Error saving file ${name}`, err.toString());
          }

          delete file?.dirty;
        });
      }
    };

    // Schedule the file to be written before the process closes.
    process.once("beforeExit", file.dirty);
  }
};

/**
 * Appends text to a given file.
 *
 * @param path The path to the file to update.
 * @param text The replacement text.
 */
export const append = (path: string, text: string): void => {
  const fileContent = readFileSync(path);
  writeFileSync(path, fileContent + text);

  helpers.logInfo(`file appended\n${path}`);
};

/**
 * Copy a directory from a source location to destination location
 * with a given ejs template configuration and platform.
 *
 * @param source The source location path
 * @param dest The destination location path
 * @param options ejs configuration
 * @param platform Native platform
 * @param root If it is root level directory
 */
export const copyDir = async (
  source: string,
  dest: string,
  options: ejs.Data,
  platform: "ios" | "android",
  root = true
) => {
  const BINARIES = /(gradlew|\.(jar|keystore|png|jpg|gif))$/;

  await fs.mkdirp(dest);

  const files = await fs.readdir(source);

  for (const f of files) {
    if (
      fs.lstatSync(nodePath.join(source, f)).isDirectory() &&
      f !== platform &&
      root
    ) {
      continue;
    }
    const target = nodePath.join(
      dest,
      ejs.render(f.replace(/^\$/, ""), options, {
        openDelimiter: "{",
        closeDelimiter: "}",
      })
    );

    const file = nodePath.join(source, f);
    const stats = await fs.stat(file);

    if (stats.isDirectory()) {
      await copyDir(file, target, options, platform, false);
    } else if (!file.match(BINARIES)) {
      const content = await fs.readFile(file, "utf8");

      await fs.writeFile(target, ejs.render(content, options));
    } else {
      await fs.copyFile(file, target);
    }
  }
};
