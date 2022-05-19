export type Position = 'after' | 'before';

/**
 * A callback function that generates an item to be inserted
 * between items in an array
 *
 * @template T The type of items in the original array
 * @template V The type of items to be inserted
 * @param index The original index of the item prior to where this
 * separator will be inserted
 * @param array The original array before items have been inserted
 * @param position The position of the separator
 * @return A value that will be inserted between items in the `array`
 */
export type SeparatorGenerator<T, V> = (index: number, array: T[], position: Position) => V;

export interface InsertBetweenOptions {
  double?: boolean;
}

/**
 * This creates a new array from a given `array` with items generated
 * from the `separatorGenerator` in between each item of the original
 * `array`
 *
 * @template T The type of items in the original array
 * @template V The type of items to be inserted
 * @param array an array of some items
 * @param separatorGenerator a callback function that
 * generates the items to be inserted between each item of the `array`
 * @param options additional options
 * @return a new array with values from the `separatorGenerator`
 * inserted between each item of the original `array`
 */
export const insertBetween = <T, V>(
  array: T[],
  separatorGenerator: SeparatorGenerator<T, V>,
  options?: InsertBetweenOptions
) =>
  array.flatMap((value, index) =>
    array.length - 1 !== index
      ? options?.double && index > 0
        ? [
            separatorGenerator(index, array, 'before'),
            value,
            separatorGenerator(index, array, 'after'),
          ]
        : [value, separatorGenerator(index, array, 'after')]
      : options?.double
      ? [separatorGenerator(index, array, 'before'), value]
      : value
  );
