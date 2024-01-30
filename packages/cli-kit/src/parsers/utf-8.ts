import fs from "fs/promises";

/**
 * Reads content from a file, applies a callback function to the content,
 * and writes the transformed content back to the same file, all using UTF-8 encoding.
 *
 * @param {string} filePath - The path to the file to be read and written.
 * @param {Function} callback - The callback function applied to the file content.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 *
 * @example
 * ```typescript
 * const filePath = "/path/to/file.txt";
 *
 * await withUTF8(filePath, (content) => {
 *   // Modify the content as needed
 *   return content.toUpperCase();
 * });
 * ```
 */
export async function withUTF8(
  filePath: string,
  callback: Function
): Promise<void> {
  /**
   * Reads the content of the file at the specified path using UTF-8 encoding.
   *
   * @returns {Promise<string>} A Promise that resolves to the file content as a string.
   */
  const content = await fs.readFile(filePath, "utf-8");

  /**
   * Applies the callback function to the file content.
   *
   * @param {string} content - The content of the file.
   * @returns {string} The transformed content.
   */
  const transformedContent = callback(content);

  /**
   * Writes the transformed content back to the file using UTF-8 encoding.
   *
   * @returns {Promise<void>} A Promise that resolves once the write operation is complete.
   */
  await fs.writeFile(filePath, transformedContent, "utf-8");
}
