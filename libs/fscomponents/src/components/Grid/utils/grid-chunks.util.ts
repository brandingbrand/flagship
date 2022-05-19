import type { GridItem, Width } from './grid.util';
import { FullWidth, isGridItem, makeGridItem } from './grid.util';

export type InsertRowTable<T> = Record<number, T>;

export interface ChunkOptions<T, E = undefined> {
  insertRows?: InsertRowTable<T>;
  emptyValue?: E;
  autoFit?: boolean;
}

export const getAbsoluteWidth = (width: Width, totalColumns: number): number =>
  width === FullWidth || width > totalColumns ? totalColumns : width;

const makeInserter =
  <T>(insertRows?: InsertRowTable<T>) =>
  (
    columnIndex: number,
    row: number
  ): { value: GridItem<T> | T; hasInserted: () => void } | undefined => {
    const insertedRow = insertRows?.[row];
    if (columnIndex === 0 && insertedRow) {
      return { value: makeGridItem(insertedRow, FullWidth), hasInserted: () => undefined };
    }

    return undefined;
  };

const gridHasSpace = (itemWidth: Width, columnsRemaining: number, totalColumns: number) => {
  if (totalColumns === columnsRemaining) {
    return true;
  }
  if (itemWidth === FullWidth) {
    return false;
  }
  if (itemWidth <= columnsRemaining) {
    return true;
  }

  return false;
};

/**
 *
 * @param iterator
 * @param totalColumns
 * @param options
 */
// eslint-disable-next-line max-statements
export function* gridChunk<T, E = undefined>(
  iterator: Iterable<GridItem<T> | T>,
  totalColumns: number,
  options?: ChunkOptions<T, E>
): Generator<Array<GridItem<E | T>>, void> {
  const { autoFit, emptyValue, insertRows } = options ?? {};
  const generator = iterator[Symbol.iterator]();

  let buffer: Array<GridItem<E | T>> = [];

  let row = 0;
  let columnIndex = 0;
  const inserter = makeInserter(insertRows);

  const createEmptyRow = (size: number): Iterable<GridItem<E>> => ({
    *[Symbol.iterator]() {
      for (let i = 0; i < size; i++) {
        yield makeGridItem(emptyValue as E);
      }
    },
  });

  while (true) {
    const insertedItem = inserter(columnIndex, row);
    const itemWidth = isGridItem(insertedItem?.value) ? insertedItem?.value.width ?? 1 : 1;
    const columnsRemaining = totalColumns - columnIndex;

    if (!gridHasSpace(itemWidth, columnsRemaining, totalColumns)) {
      if (!autoFit) {
        const emptyRow = createEmptyRow(columnsRemaining);
        buffer.push(...emptyRow);
      }

      columnIndex += columnsRemaining;
    } else if (insertedItem !== undefined) {
      insertedItem.hasInserted();
      const item = makeGridItem(insertedItem.value);
      const width = getAbsoluteWidth(item.width, totalColumns);

      buffer.push(item);
      columnIndex += width;
    } else {
      const result = generator.next();

      // !!! If we run out of items stop everything
      if (result.done) {
        break;
      }

      const { value } = result;
      const item = makeGridItem(value, itemWidth);
      const width = getAbsoluteWidth(item.width, totalColumns);

      buffer.push(item);
      columnIndex += width;
    }

    // If we have filled the row, then emit it
    if (columnIndex >= totalColumns) {
      yield buffer;
      buffer = [];
      columnIndex = 0;
      row += 1;
    }
  }

  // With the remaining items, emit them after filling the empty spaces
  if (buffer.length > 0) {
    if (!autoFit || row > 0) {
      const columnsRemaining = totalColumns - columnIndex;
      const emptyRow = createEmptyRow(columnsRemaining);
      buffer.push(...emptyRow);
    }

    yield buffer;
  }
}
