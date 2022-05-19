import type { GridItem, Width } from './grid.util';
import { isGridItem, makeGridItem } from './grid.util';

export type WidthTable = Record<number, Width>;

export interface SizeOptions {
  widthTable?: WidthTable;
}

const makeSizer =
  (widthTable?: WidthTable) =>
  <T>(itIndex: number, item: GridItem<T> | T) => {
    const overrideWidth = widthTable?.[itIndex];
    if (overrideWidth !== undefined) {
      return overrideWidth;
    }

    return isGridItem(item) ? item.width : 1;
  };

/**
 *
 * @param iterator
 * @param options
 */
export function* gridSize<T>(iterator: Iterable<GridItem<T> | T>, options?: SizeOptions) {
  const { widthTable } = options ?? {};

  const sizer = makeSizer(widthTable);
  let iteratorIndex = 0;

  for (const value of iterator) {
    const itemWidth = sizer(iteratorIndex, value);
    yield makeGridItem(value, itemWidth);
    iteratorIndex += 1;
  }
}
