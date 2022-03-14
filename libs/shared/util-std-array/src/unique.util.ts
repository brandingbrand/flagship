// Doc Credit: Lodash - MIT

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 
 * @param array The array to inspect.
 * @returns Returns the new duplicate free array.
 * @example
 *
 * uniq([2, 1, 2])
 * // => [2, 1]
 */
export const unique = <T>(array: T[]) => {
  return array !== null && array.length ? Array.from(new Set(array)) : [];
};
