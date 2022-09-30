import type { ViewStyle } from 'react-native';

export const GridItemTag = Symbol('Grid Item Tag');
export const FullWidth = 'fill';

export type Width = number | typeof FullWidth;

export interface GridItem<T> {
  [GridItemTag]: typeof GridItemTag;
  key?: string;
  value: T;
  width: Width;
}

export const isGridItem = <T>(item: unknown): item is GridItem<T> =>
  Boolean(item && typeof item === 'object' && GridItemTag in item);

const minMaxWidth = (width: Width, maxWidth: number) => {
  if (width !== FullWidth && width > maxWidth) {
    return maxWidth;
  }

  return width;
};

const minMaxGridItemWidth = <T>(
  item: GridItem<T>,
  maxWidth = Number.POSITIVE_INFINITY
): GridItem<T> => ({
  ...item,
  width: minMaxWidth(item.width, maxWidth),
});

export const makeGridItem = <T>(
  value: GridItem<T> | T,
  width: Width = 1,
  maxWidth = Number.POSITIVE_INFINITY
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

export const getColumnGapStyle = (
  index: number,
  totalColumns: number,
  columnGap: number
): ViewStyle => {
  const halfGutter = columnGap / 2;

  /* right margin for the left most column, left for the rightmost,
   * and both sides for the middle columns
   */
  if (index % totalColumns === 0) {
    return {
      marginRight: halfGutter,
    };
  } else if (index % totalColumns === totalColumns - 1) {
    return {
      marginLeft: halfGutter,
    };
  }
  return {
    marginRight: halfGutter,
    marginLeft: halfGutter,
  };
};
