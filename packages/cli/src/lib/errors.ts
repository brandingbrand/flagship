/**
 * Checks if the provided error object is a warning based on its 'name' property.
 *
 * @param error - The error object to be checked.
 * @returns `true` if the error is a warning, otherwise `false`.
 *
 * @example
 * ```typescript
 * const myWarning = new MyWarning("This is a...");
 * const result = isWarning(myWarning);
 * console.log(result); // Output: true
 * ```
 */
export function isWarning(error: Error | unknown | any): boolean {
  /**
   * Checks if the error object has a 'name' property and if its type is a string.
   * If not, the function returns undefined, indicating that the error is not a warning.
   */
  if (!error.name || typeof error.name !== "string") return false;

  /**
   * Uses a regular expression to check if the 'name' property of the error
   * contains the word "warning" (case-insensitive).
   */
  return (error.name as string).match(/.*((w|W)arning).*/) !== null;
}
