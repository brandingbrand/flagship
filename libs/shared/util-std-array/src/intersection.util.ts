// Doc Credits: Lodash

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @param arrays The arrays to inspect.
 * @return Returns the new array of intersecting values.
 * @example
 *
 * intersection([2, 1], [2, 3])
 * // => [2]
 */
export const intersection = <T>(...arrays: T[][]) => {
  const [firstArray, ...otherArrays] = arrays;

  return firstArray?.filter((value) => otherArrays.every((array) => array.includes(value))) ?? [];
};
