/**
 * Global variable to store the unmount function from react-ink.
 *
 * @global
 */
declare global {
  var unmount:
    | ((error?: number | Error | null | undefined) => void)
    | undefined;
}

/**
 * Export an empty object to ensure proper module augmentation in TypeScript.
 *
 * @remarks
 * This export statement is needed to allow merging declarations with the global scope.
 * Without it, TypeScript will not recognize the global variable declarations.
 *
 * @example
 * ```typescript
 * // Use an empty export to allow merging with global declarations
 * export {};
 * ```
 */
export {};
