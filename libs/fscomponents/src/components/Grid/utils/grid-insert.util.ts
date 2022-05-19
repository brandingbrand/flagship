import type { GridItem } from './grid.util';

export type InsertAfterTable<T> = Record<number, GridItem<T> | T>;
export interface InsertEveryOptions<T> {
  frequency: number;
  values: Array<GridItem<T> | T> | GridItem<T> | T;
}

export interface InsertOptions<T> {
  insertAfter?: InsertAfterTable<T>;
  insertEvery?: InsertEveryOptions<T>;
}

const makeInserter = <T>(
  insertAfter?: InsertAfterTable<T>,
  insertEvery?: InsertEveryOptions<T>
) => {
  const insertedIndexes = new Set<number>();
  const insertedIntervals = new Set<number>();

  return (itIndex: number): { value: GridItem<T> | T; hasInserted: () => void } | undefined => {
    const insertedIndex = insertAfter?.[itIndex - 1];
    if (insertedIndex !== undefined && !insertedIndexes.has(itIndex)) {
      const hasInserted = () => insertedIndexes.add(itIndex);

      return { value: insertedIndex, hasInserted };
    }

    if (insertEvery !== undefined) {
      const iteration = Math.floor(itIndex / insertEvery.frequency);
      const shouldInsert = itIndex > 0 && itIndex % insertEvery.frequency === 0;
      if (shouldInsert && !insertedIntervals.has(iteration)) {
        const hasInserted = () => insertedIntervals.add(iteration);

        if (Array.isArray(insertEvery.values)) {
          const value = insertEvery.values[iteration];
          if (value === undefined) {
            return undefined;
          }

          return {
            value,
            hasInserted,
          };
        }

        return { value: insertEvery.values, hasInserted };
      }
    }

    return undefined;
  };
};

/**
 *
 * @param iterator
 * @param options
 */
export function* gridInsert<T>(iterator: Iterable<T>, options?: InsertOptions<T>) {
  const { insertAfter, insertEvery } = options ?? {};
  const generator = iterator[Symbol.iterator]();

  let iteratorIndex = 0;
  const inserter = makeInserter(insertAfter, insertEvery);

  while (true) {
    const insertedItem = inserter(iteratorIndex);
    if (insertedItem !== undefined) {
      insertedItem.hasInserted();
      yield insertedItem.value;
    } else {
      const result = generator.next();
      // !!! If we run out of items stop everything
      if (result.done) {
        break;
      }

      yield result.value;

      iteratorIndex += 1;
    }
  }
}
