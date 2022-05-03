import { GridItem, isGridItem, Width, makeGridItem } from './grid.util';

export type WidthTable = Record<number, Width>;

export interface SizeOptions {
  widthTable?: WidthTable;
}

const makeSizer = (widthTable?: WidthTable) => {
  return <T>(itIndex: number, item: T | GridItem<T>) => {
    const overrideWidth = widthTable?.[itIndex];
    if (overrideWidth !== undefined) {
      return overrideWidth;
    }

    return isGridItem(item) ? item.width : 1;
  };
};

export function* gridSize<T>(iterator: Iterable<T | GridItem<T>>, options?: SizeOptions) {
  const { widthTable } = options ?? {};

  const sizer = makeSizer(widthTable);
  let iteratorIndex = 0;

  for (const value of iterator) {
    const itemWidth = sizer(iteratorIndex, value);
    yield makeGridItem(value, itemWidth);
    iteratorIndex += 1;
  }
}
