import fs from "fs/promises";
import { glob, sync } from "glob";
import path from "path";

/**
 * Glob files, read their content, replace a specified value, and write the updated content back to the files.
 *
 * @param {string} pattern - The glob pattern to match files.
 * @param {RegExp | string} oldText - The substring or regular expression to be replaced.
 * @param {string} newText - The new substring that replaces occurrences of the oldText.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
export async function globAndReplace(
  pattern: string,
  oldText: RegExp | string,
  newText: string
): Promise<void> {
  /**
   * Replace occurrences of the specified substring or matches of the regular expression in a given content.
   *
   * @param {string} content - The original content.
   * @param {RegExp | string} oldText - The substring or regular expression to be replaced.
   * @param {string} newText - The new substring.
   * @returns {string} The content with replacements applied.
   */
  const replaceInContent = (
    content: string,
    oldText: RegExp | string,
    newText: string
  ): string => content.replace(oldText, newText);

  /**
   * Process each file in the glob result, read content, replace values, and write the updated content back.
   *
   * @param {string[]} files - An array of file paths to process.
   */
  const processFiles = async (files: string[]): Promise<void> => {
    for (const filePath of files) {
      const absoluteFilePath = path.resolve(filePath);
      const originalContent = await fs.readFile(absoluteFilePath, "utf-8");
      const updatedContent = replaceInContent(
        originalContent,
        oldText,
        newText
      );

      await fs.writeFile(absoluteFilePath, updatedContent, "utf-8");
    }
  };

  const files = await glob(pattern);
  await processFiles(files);
}

/**
 * Get an array of file and directory paths within a specified directory
 * that match a given substring (case-sensitive and case-insensitive).
 *
 * @param {string} directory - The directory in which to search for matching files/directories.
 * @param {string} oldName - The substring to match against file/directory names.
 * @returns {string[]} An array of unique file and directory paths matching the specified criteria.
 *
 * @example
 * ```typescript
 * const directoryPath = '/path/to/directory';
 * const substringToMatch = 'oldName';
 * const matchingFiles = getMatchingFiles(directoryPath, substringToMatch);
 * console.log(matchingFiles);
 * ```
 */
export function getMatchingFiles(directory: string, oldName: string): string[] {
  /**
   * Options for the globbing process.
   *
   * @type {object}
   * @property {boolean} nosort - If true, the result is not sorted.
   * @property {boolean} dot - If true, patterns starting with a dot match files starting with a dot (hidden files).
   */
  const globOptions = {
    nosort: true,
    dot: true,
  };

  /**
   * Find files/directories that contain the specified substring (case-sensitive).
   *
   * @type {string[]}
   */
  const caseSensitiveResults = sync(
    `${directory}/**/*${oldName}*`,
    globOptions
  );

  /**
   * Find files/directories that contain the specified substring (case-insensitive).
   *
   * @type {string[]}
   */
  const caseInsensitiveResults = sync(
    `${directory}/**/*${oldName.toLocaleLowerCase()}*`,
    globOptions
  );

  /**
   * Combine case-sensitive and case-insensitive results, removing duplicate paths.
   *
   * @type {string[]}
   */
  const results = [...caseSensitiveResults, ...caseInsensitiveResults];

  /**
   * Remove duplicate paths from the results array.
   *
   * @type {string[]}
   */
  const uniqueResults = [...new Set(results)];

  /**
   * Sort the results so that paths with higher depth come first.
   *
   * @type {string[]}
   */
  uniqueResults.sort((a, b) => b.length - a.length);

  return uniqueResults;
}
