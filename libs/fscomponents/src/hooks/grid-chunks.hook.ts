import { useMemo } from 'react';

const GridItemTag = Symbol('Grid Item Tag');
export const FullWidth = 'fill';

export type Width = number | typeof FullWidth;

export interface GridItem<T> {
  [GridItemTag]: typeof GridItemTag;
  value: T;
  width: Width;
}

export type WidthTable = Record<number, Width>;
export type InsertAfterTable<T> = Record<number, T | GridItem<T>>;
export type InsertRowTable<T> = Record<number, T>;
export interface InsertEveryOptions<T> {
  frequency: number;
  values: (T | GridItem<T>) | (T | GridItem<T>)[];
}

export interface ChunkOptions<T, E = undefined> {
  widthTable?: WidthTable;
  insertRows?: InsertRowTable<T>;
  insertAfter?: InsertAfterTable<T>;
  insertEvery?: InsertEveryOptions<T>;
  emptyValue?: E;
}

const isGridItem = <T>(item: unknown): item is GridItem<T> =>
  !!(item && typeof item === 'object' && GridItemTag in item);

const minMaxWidth = (width: Width, maxWidth: number) => {
  if (width !== FullWidth && width > maxWidth) {
    return maxWidth;
  }

  return width;
};

const minMaxGridItemWidth = <T>(item: GridItem<T>, maxWidth: number = Infinity): GridItem<T> => ({
  ...item,
  width: minMaxWidth(item.width, maxWidth),
});

export const makeGridItem = <T>(
  value: T | GridItem<T>,
  width: Width = 1,
  maxWidth: number = Infinity
): GridItem<T> => {
  if (isGridItem(value)) {
    return minMaxGridItemWidth(value, maxWidth);
  }

  return {
    [GridItemTag]: GridItemTag,
    value,
    width: minMaxWidth(width, maxWidth),
  };
};

export const getAbsoluteWidth = (width: Width, totalColumns: number): number =>
  width === FullWidth || width > totalColumns ? totalColumns : width;

const makeSizer = (widthTable?: WidthTable) => {
  return <T>(itIndex: number, insertedItem: T | GridItem<T>) => {
    if (insertedItem !== undefined) {
      return isGridItem(insertedItem) ? insertedItem.width : 1;
    }

    return widthTable?.[itIndex] ?? 1;
  };
};

const makeInserter = <T>(
  insertIndexes?: InsertAfterTable<T>,
  insertEvery?: InsertEveryOptions<T>,
  insertRows?: InsertRowTable<T>
) => {
  const insertedIndexes = new Set<number>();
  const insertedIntervals = new Set<number>();

  // eslint-disable-next-line complexity
  return (
    itIndex: number,
    columnIndex: number,
    row: number
  ): { value: T | GridItem<T>; hasInserted: () => void } | undefined => {
    const insertedIndex = insertIndexes?.[itIndex - 1];
    if (insertedIndex !== undefined && !insertedIndexes.has(itIndex)) {
      return { value: insertedIndex, hasInserted: () => insertedIndexes.add(itIndex) };
    }

    const insertedRow = insertRows?.[row];
    if (columnIndex === 0 && insertedRow) {
      return { value: makeGridItem(insertedRow, FullWidth), hasInserted: () => undefined };
    }

    if (insertEvery !== undefined) {
      const iteration = Math.floor(itIndex / insertEvery.frequency);
      const shouldInsert = itIndex > 0 && itIndex % insertEvery.frequency === 0;
      if (shouldInsert && !insertedIntervals.has(iteration)) {
        const hasInserted = () => insertedIntervals.add(iteration);

        if (Array.isArray(insertEvery?.values)) {
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

export function* chunkGrid<T, E = undefined>(
  it: Iterable<T>,
  totalColumns: number,
  options?: ChunkOptions<T, E>
): Generator<GridItem<T | E>[], void> {
  const { emptyValue, widthTable, insertAfter, insertEvery, insertRows } = options ?? {};
  const generator = it[Symbol.iterator]();

  let buffer: GridItem<T | E>[] = [];

  let row = 0;
  let itIndex = 0;
  let columnIndex = 0;
  const inserter = makeInserter(insertAfter, insertEvery, insertRows);
  const sizer = makeSizer(widthTable);

  const createEmptyRow = (size: number) =>
    new Array<GridItem<E>>(size).fill(makeGridItem(emptyValue as E));

  while (true) {
    const insertedItem = inserter(itIndex, columnIndex, row);
    const itemWidth = sizer(itIndex, insertedItem?.value);
    const columnsRemaining = totalColumns - columnIndex;

    if (!gridHasSpace(itemWidth, columnsRemaining, totalColumns)) {
      const emptyRow = createEmptyRow(columnsRemaining);

      buffer.push(...emptyRow);
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
      itIndex += 1;
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
    const columnsRemaining = totalColumns - columnIndex;
    const emptyRow = createEmptyRow(columnsRemaining);
    buffer.push(...emptyRow);
    yield buffer;
  }
}

export const useGridChunks = <T, E = undefined>(
  it: Iterable<T>,
  columns: number,
  options?: ChunkOptions<T, E>
) => {
  return useMemo(() => chunkGrid(it, columns, options), [it, columns, options]);
};
