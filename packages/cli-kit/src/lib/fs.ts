import fsPromises from "fs/promises";
import fse from "fs-extra";

import path from "./path";
import { FsWarning } from "./errors";
import { getMatchingFiles } from "./glob";

/**
 * Extended file system utility that includes additional functions.
 */
export default {
  /**
   * Spread all current fs/promises functions so they can be
   * used along with new useful functions.
   */
  ...fsPromises,

  /**
   * Checks if a keyword exists in a file.
   *
   * @param {string} path - The path to the file to check for the keyword.
   * @param {RegExp | string} keyword - The keyword to search for in the file.
   * @return {Promise<boolean>} True if the keyword exists in the file.
   */
  doesKeywordExist: async function (
    path: string,
    keyword: RegExp | string
  ): Promise<boolean> {
    const fileContent = await fsPromises.readFile(path, "utf-8");

    if (typeof keyword === "string") {
      return fileContent.includes(keyword);
    }

    return keyword.test(fileContent);
  },

  /**
   * Checks if a path exists.
   *
   * @param {string} path - The path to the file to check for existence.
   * @return {Promise<boolean>} A Promise that resolves to true if the path exists, otherwise false.
   */
  doesPathExist: async function (path: string): Promise<boolean> {
    try {
      // Attempts to access the path asynchronously
      await fsPromises.access(path);

      // If the access is successful, return true
      return true;
    } catch (error) {
      // If an error occurs (e.g., file does not exist), return false
      return false;
    }
  },

  /**
   * Updates a file asynchronously, replacing a given string with a new one.
   *
   * @param {string} path - The path to the file to update.
   * @param {RegExp | string} oldText - The old text to replace.
   * @param {string} newText - The replacement text.
   * @return {Promise<void>}
   */
  update: async function (
    path: string,
    oldText: RegExp | string,
    newText: string
  ): Promise<void> {
    const exists = await this.doesKeywordExist(path, oldText);

    if (!exists) {
      throw new FsWarning(
        `cannot find keyword: ${oldText} in file path: ${path}`
      );
    }

    const fileContent = await fsPromises.readFile(path, "utf-8");

    await fsPromises.writeFile(path, fileContent.replace(oldText, newText));
  },

  /**
   * Updates the directory structure to match a new namespace.
   *
   * @param {string} oldPkg - The old package name to replace.
   * @param {string} newPkg - The new package name to use.
   * @param {...string} pathComponents - Path components to the directory in which to replace the project name.
   * @return {Promise<void>}
   */
  renameAndCopyDirectory: async function (
    oldPkg: string,
    newPkg: string,
    ...pathComponents: string[]
  ): Promise<void> {
    const directory = path.project.resolve(...pathComponents);
    const oldPathPart = oldPkg.replace(/\./g, "/");
    const newPathPart = newPkg.replace(/\./g, "/");

    const results = getMatchingFiles(directory, oldPathPart);

    for (const oldPath of results) {
      const newPath = oldPath.replace(oldPathPart, newPathPart);
      await fse.move(oldPath, newPath);
    }

    for (const dir of oldPkg
      .split(".")
      .reduce<string[]>((parts, part, index, arr) => {
        const pattern = [...arr.slice(0, index), part].join("/");
        parts.push(...getMatchingFiles(directory, pattern));
        return parts;
      }, [])
      .reverse()) {
      const contents =
        (await fse.pathExists(dir)) && (await fsPromises.readdir(dir));
      if (Array.isArray(contents) && contents.length === 0) {
        await fse.remove(dir);
      }
    }
  },
};
