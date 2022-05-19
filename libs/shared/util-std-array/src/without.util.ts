// Doc Credit: Lodash - MIT

/**
 * Creates an array excluding all given values using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `pull`, this method returns a new array.
 *
 * @param array The array to inspect.
 * @param [values] The values to exclude.
 * @return Returns the new array of filtered values.
 * @example
 *
 * without([2, 1, 2, 3], 1, 2)
 * // => [3]
 */
export const without = <T>(array: T[], ...values: T[]) =>
  Array.isArray(array) ? array.filter((item) => !values.includes(item)) : [];
