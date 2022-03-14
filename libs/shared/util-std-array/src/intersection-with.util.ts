// Doc Credits: Lodash

/**
 * This method is like `intersection` except that it accepts `comparator`
 * which is invoked to compare elements of `arrays`. The order and references
 * of result values are determined by the first array. The comparator is
 * invoked with two arguments: (arrVal, othVal).
 *
 * @param comapritor The comparator invoked per element
 * @param arrays The arrays to inspect.
 * @returns Returns the new array of intersecting values.
 * @example
 *
 * const objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
 * const others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }]
 *
 * intersectionWith(isEqual, objects, others)
 * // => [{ 'x': 1, 'y': 2 }]
 */
export const intersectionWith = <T>(compareFunction: (a: T, b: T) => boolean, ...arrays: T[][]) => {
  const [firstArray, ...otherArrays] = arrays;

  return firstArray.filter((a) =>
    otherArrays.every((array) => array.some((b) => compareFunction(a, b)))
  );
};
