import type { ComponentType, ReactElement } from 'react';

import type {
  FlatListProps,
  ListRenderItemInfo,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type { GridItem, InsertAfterTable, InsertRowTable, WidthTable } from './utils';

export type GridScrollToTopFunc = () => void;
export interface BackToTopComponentProps {
  backToTop: GridScrollToTopFunc;
}

export interface GridRenderItemInfo<ItemT> extends ListRenderItemInfo<ItemT> {
  totalColumns?: number;
  columns?: number;
}

export type GridRenderItem<ItemT> = (info: GridRenderItemInfo<ItemT>) => ReactElement | null;
export type GridRow<ItemT> = Array<GridItem<ItemT | null>>;

// TODO [>=12.0.0] (@wSedlacek): remove deprecated props
export interface GridProps<ItemT>
  extends Pick<
    FlatListProps<ItemT>,
    | 'accessibilityHint'
    | 'accessibilityLabel'
    | 'accessibilityRole'
    | 'accessible'
    | 'data'
    | 'ListEmptyComponent'
    | 'ListFooterComponent'
    | 'ListFooterComponentStyle'
    | 'ListHeaderComponent'
    | 'ListHeaderComponentStyle'
    | 'onLayout'
    | 'onRefresh'
    | 'refreshControl'
    | 'refreshing'
    | 'style'
  > {
  /**
   * Takes an item from data and renders it into the list. Typical usage:
   * ```
   * _renderItem = ({item}) => (
   *   <TouchableOpacity onPress={() => this._onPress(item)}>
   *     <Text>{item.title}</Text>
   *   <TouchableOpacity/>
   * );
   * ...
   * <FlatList data={[{title: 'Title Text', key: 'item1'}]} renderItem={this._renderItem} />
   * ```
   * Provides additional metadata like `index` if you need it.
   */
  renderItem: GridRenderItem<ItemT>;

  keyExtractor?: <ItemT extends GridItem<{ id?: string; key?: string } | null>>(
    items: ItemT[],
    index: number
  ) => string;

  /**
   * The number of columns to display in the grid.
   *
   * @deprecated to be removed in fs12, use numColumns instead
   */
  columns?: number;

  /**
   * Whether or not a back to top button should appear after the user scrolls down. Defaults to
   * false.
   *
   * @deprecated to be removed in fs12, use BackToTopButton instead
   */
  showBackToTop?: boolean;

  /**
   * An optional function to render a header component displayed at the top of the grid.
   *
   * @deprecated to be removed in fs12, use ListHeaderComponent instead
   */
  renderHeader?: () => JSX.Element | null;

  /**
   * An optional function to render a footer component, displayed at the bottom of the grid.
   *
   * @deprecated to be removed in fs12, use ListFooterComponent instead
   */
  renderFooter?: () => JSX.Element | null;

  /**
   * Styles to apply to the container around the back to top button
   *
   * @deprecated to be removed in fs12, use BackToTopStyle instead
   */
  backToTopContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Styles to apply to the back to top button. Does not apply if a custom back to top render
   * function is used.
   *
   * @deprecated to be removed in fs12, use BackToTopButton instead
   */
  backToTopButtonStyle?: StyleProp<ViewStyle>;

  /**
   * Styles to apply to the default back to top text. Does not apply if a custom back to top render
   * function is used.
   *
   * @deprecated to be removed in fs12, use BackToTopButton instead
   */
  backToTopTextStyle?: StyleProp<TextStyle>;

  /**
   * Copy to show inside the back to top button. Defaults to "Top". Does not apply if a custom back
   * to top render function is used.
   *
   * @deprecated to be removed in fs12, use BackToTopButton instead
   */
  backToTopText?: string;

  /**
   * The distance the user needs to scroll down before the back to top button appears. Defaults to
   * 100.
   *
   * @deprecated to be removed in fs12, use BackToTopShowAtHeight instead
   */
  backToTopShowAtHeight?: number;

  /**
   * An optional custom render function to render a back to top button.
   *
   * @deprecated use BackToTopButton instead
   */
  renderBackToTopButton?: (scrollToTop: GridScrollToTopFunc) => JSX.Element;

  /**
   * Props to pass to the underlying FlatList.
   *
   * @deprecated to be removed in fs12. Not supported on Web.
   */
  listViewProps?: Partial<FlatListProps<GridRow<ItemT>>>;

  /**
   * Whether or not to show a separator between columns in the grid.
   *
   * @deprecated to be removed in fs12. Not supported on Web. Use columnGap for gutters
   */
  showColumnSeparators?: boolean;

  /**
   * Style to apply to the separator between columns in the grid.
   *
   * @deprecated to be removed in fs12. Not supported on Web. Use columnGap for gutters.
   */
  columnSeparatorStyle?: StyleProp<ViewStyle>;

  /**
   * Whether or not to show a separator between rows in the grid.
   *
   * @deprecated to be removed in fs12. Not supported on Web. Use rowGap for gutters.
   */
  showRowSeparators?: boolean;

  /**
   * Style to apply to the separator between rows in the grid.
   *
   * @deprecated to be removed in fs12. Not supported on Web. Use rowGap for gutters.
   */
  rowSeparatorStyle?: StyleProp<ViewStyle>;

  /**
   * Style to apply to parent view component.
   */
  gridContainerStyle?: StyleProp<ViewStyle>;

  /**
   * The distance the user needs to scroll down before the back to top button appears. Defaults to
   * 100.
   */
  BackToTopShowAtHeight?: number;

  /**
   * Styles to apply to the container around the back to top button
   */
  BackToTopStyle?: StyleProp<ViewStyle>;

  /**
   * An optional custom render function to render a back to top button.
   */
  BackToTopComponent?: ComponentType<BackToTopComponentProps> | ReactElement;

  /**
   * The number of columns to display in the grid. Defaults to 'auto'.
   *
   * Note: When using `auto` there will always be at least 1 blank render
   * prior to items being rendered while the container is measured.
   */
  numColumns?: number | 'auto';

  /**
   * The minium column width when `numColumns` is set to `auto`
   * Defaults to 175
   */
  minColumnWidth?: number;

  /**
   * A map of index with the preferred columns of the item at that index.
   */
  columnWidthTable?: WidthTable;

  insertRows?: InsertRowTable<ItemT>;
  insertAfter?: InsertAfterTable<ItemT>;
  insertEveryFrequency?: number;
  insertEveryValues?: Array<GridItem<ItemT> | ItemT> | GridItem<ItemT> | ItemT;

  dataSet?: Record<string, ''>;

  /**
   * Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
   *
   * @deprecated to be removed in fs12. Not supported on web. Load More button provides superior UX
   */
  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null;

  /**
   * How far from the end (in units of visible length of the list) the bottom edge of the
   * list must be from the end of the content to trigger the `onEndReached` callback.
   * Thus a value of 0.5 will trigger `onEndReached` when the end of the content is
   * within half the visible length of the list.
   *
   * @deprecated to be removed in fs12. Not supported on web. Load More button provides superior UX
   */
  onEndReachedThreshold?: number | null;

  /**
   * Wether or not a grid should add columns for empty spaces when all existing items have a column
   */
  autoFit?: boolean;

  /**
   * Space between columns in the grid.
   */
  columnGap?: number;

  /**
   * Space between rows in the grid.
   */
  rowGap?: number;
}
