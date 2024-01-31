import { StringWarning } from "./errors";

/**
 * Replaces occurrences of a specified substring or regular expression in the given content
 * with a new substring.
 *
 * Throws a StringWarning if the original content does not contain the specified substring or match the regular expression.
 *
 * @param {string} content - The original content in which replacements are to be made.
 * @param {RegExp | string} oldText - The substring or regular expression to be replaced.
 * @param {string} newText - The new substring that replaces occurrences of the oldText.
 * @returns {string} The content with replacements applied.
 *
 * @throws {StringWarning} Throws a StringWarning if the original content does not contain oldText or match the regular expression.
 *
 * @example
 * ```typescript
 * const originalContent = "Hello, world!";
 * const newText = replace(originalContent, /world/i, "there");
 * console.log(newText); // Output: "Hello, there!"
 * ```
 */
export function replace(
  content: string,
  oldText: RegExp | string,
  newText: string
): string {
  /**
   * Throws a StringWarning if the original content does not contain the specified substring or match the regular expression.
   *
   * @throws {StringWarning} Throws a StringWarning if the condition is not met.
   */
  if (content.match(oldText) === null) {
    throw new StringWarning(`string does not contain value: ${oldText}`);
  }

  /**
   * Replaces occurrences of the specified substring or matches of the regular expression with the new substring.
   *
   * @param {RegExp | string} oldText - The substring or regular expression to be replaced.
   * @param {string} newText - The new substring.
   * @returns {string} The content with replacements applied.
   */
  return content.replace(oldText, newText);
}
