import fs from "fs/promises";

import { FsWarning } from "./errors";

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
