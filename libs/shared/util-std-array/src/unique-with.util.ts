// Doc Credit: Lodash - MIT

/**
 * This method is like `uniq` except that it accepts `comparator` which
 * is invoked to compare elements of `array`. The order of result values is
 * determined by the order they occur in the array. The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @param array The array to inspect.
 * @param compareFunction The comparator invoked per element.
 * @returns Returns the new duplicate free array.
 * @example
 *
 * const objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }]
 *
 * uniqWith(objects, isEqual)
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
 */
export const uniqueWith = <T>(array: T[], compareFunction: (a: T, b: T) => boolean) => {
  const isUnique = (a: T, aIndex: number) => (b: T, bIndex: number) => {
    if (aIndex === bIndex) {
      return true;
    }

    return !compareFunction(a, b);
  };

  const isFirstIndex = (item: T, index: number) => {
    const firstIndex = array.findIndex((b) => compareFunction(item, b));
    return index === firstIndex;
  };

  return array.filter((a, aIndex) => {
    return isFirstIndex(a, aIndex) || array.every(isUnique(a, aIndex));
  });
};
