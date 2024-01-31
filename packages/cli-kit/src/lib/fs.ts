import fs from "fs/promises";
import fse from "fs-extra";

import { FsWarning } from "./errors";
import { getMatchingFiles } from "./glob";
import { paths } from "./paths";

/**
 * Checks if a keyword exists in a file.
 *
 * @param path The path to the file to check for the keyword.
 * @param keyword The keyword to search for in the file
 * @return True if the keyword exists in the file.
 */
export async function doesKeywordExist(
  path: string,
  keyword: RegExp | string
): Promise<boolean> {
  const fileContent = (await fs.readFile(path)).toString();
  if (typeof keyword === "string") {
    return fileContent.includes(keyword);
  }

  return keyword.test(fileContent);
}

/**
 * Updates a file asynchronously, replacing a given string with a new one.
 *
 * @param path The path to the file to update.
 * @param oldText The old text to replace.
 * @param newText The replacement text.
 * @return
 */
export async function update(
  path: string,
  oldText: RegExp | string,
  newText: string
): Promise<void> {
  if (!(await doesKeywordExist(path, oldText))) {
    throw new FsWarning(
      `cannot find keyword: ${oldText} in file path: ${path}`
    );
  }

  const fileContent = await fs.readFile(path);

  await fs.writeFile(path, fileContent.toString().replace(oldText, newText));
}

/**
 * Updates the directory structure to match a new namespace
 *
 * @param oldPkg The old package name to replace.
 * @param newPkg The new package name to use.
 * @param pathComponents Path components to the directory in which to
 * replace the project name.
 */
export async function renameAndCopyDirectory(
  oldPkg: string,
  newPkg: string,
  ...pathComponents: string[]
): Promise<void> {
  const directory = paths.project.resolve(...pathComponents);
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
    const contents = (await fse.pathExists(dir)) && (await fs.readdir(dir));
    if (Array.isArray(contents) && contents.length === 0) {
      await fse.remove(dir);
    }
  }
}
