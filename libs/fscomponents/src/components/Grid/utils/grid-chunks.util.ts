import { GridItem, isGridItem, Width, FullWidth, makeGridItem } from './grid.util';

export type InsertRowTable<T> = Record<number, T>;

export interface ChunkOptions<T, E = undefined> {
  insertRows?: InsertRowTable<T>;
  emptyValue?: E;
  autoFit?: boolean;
}

export const getAbsoluteWidth = (width: Width, totalColumns: number): number =>
  width === FullWidth || width > totalColumns ? totalColumns : width;

const makeInserter = <T>(insertRows?: InsertRowTable<T>) => {
  return (
    columnIndex: number,
    row: number
  ): { value: T | GridItem<T>; hasInserted: () => void } | undefined => {
    const insertedRow = insertRows?.[row];
    if (columnIndex === 0 && insertedRow) {
      return { value: makeGridItem(insertedRow, FullWidth), hasInserted: () => undefined };
    }

    return undefined;
  };
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

// eslint-disable-next-line complexity
export function* gridChunk<T, E = undefined>(
  iterator: Iterable<T | GridItem<T>>,
  totalColumns: number,
  options?: ChunkOptions<T, E>
): Generator<GridItem<T | E>[], void> {
  const { emptyValue, insertRows, autoFit } = options ?? {};
  const generator = iterator[Symbol.iterator]();

  let buffer: GridItem<T | E>[] = [];

  let row = 0;
  let columnIndex = 0;
  const inserter = makeInserter(insertRows);

  const createEmptyRow = (size: number): Iterable<GridItem<E>> => {
    return {
      *[Symbol.iterator]() {
        for (let i = 0; i < size; i++) {
          yield makeGridItem(emptyValue as E);
        }

        return;
      },
    };
  };

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
