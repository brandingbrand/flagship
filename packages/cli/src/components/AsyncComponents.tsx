/**
 * Asynchronously loads Ink components.
 * @returns An object containing Ink components.
 * @remarks
 * This function asynchronously imports Ink components and returns them in an object.
 * Components include the main Ink library and the Spinner component.
 * @example
 * ```typescript
 * const { Box, Text, Spinner } = await AsyncComponents();
 * <Box><Text>Loading...</Text><Spinner/></Box>
 * ```
 */
export async function AsyncComponents() {
  /**
   * Imports the Ink library asynchronously.
   * @type {Promise<typeof import("ink")>} A promise resolving to the imported Ink library.
   */
  const ink = await import("ink");

  /**
   * Imports the Ink Spinner component asynchronously.
   * @type {Promise<{ default: typeof import("ink-spinner").default }>} A promise resolving to the imported Spinner component.
   */
  const inkSpinner = await import("ink-spinner");

  /**
   * An object containing imported Ink components.
   * @type {Object}
   * @property {typeof import("ink")} ink The imported Ink library.
   * @property {typeof import("ink-spinner").default} Spinner The imported Spinner component.
   */
  return {
    ...ink,
    Spinner: inkSpinner.default,
  };
}
