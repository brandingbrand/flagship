import React, {
  ComponentType,
  isValidElement,
  ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  FlatList,
  FlatListProps,
  ListRenderItem,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  ChunkOptions,
  getAbsoluteWidth,
  GridItem,
  InsertAfterTable,
  InsertRowTable,
  useGridChunks,
  WidthTable,
} from '../hooks/grid-chunks.hook';

const DEFAULT_COLUMNS = 2;
const DEFAULT_MIN_COLUMNS = 175;
const DEFAULT_BACK_TOP_BUTTON_SHOW_AT_HEIGHT = 100;
const DEFAULT_KEY_EXTRACTOR = <ItemT extends GridItem<{ id?: string; key?: string } | null>>(
  items: ItemT[],
  index: number
): string => {
  const key = items
    .map((item) => item.value?.key ?? item.value?.id)
    .filter(Boolean)
    .join();

  return key || `${index}`;
};

const gridStyle = StyleSheet.create({
  row: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  item: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  itemRow: {
    flex: 1,
    justifyContent: 'space-between',
  },
  rowSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#8E8E8E',
  },
  columnSeparator: {
    height: '100%',
    width: 1,
    backgroundColor: '#8E8E8E',
  },
  scrollTopButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 200,
  },
  scrollTopButton: {
    backgroundColor: '#eee',
    padding: 10,
  },
});

export type GridScrollToTopFunc = () => void;
export interface BackToTopComponentProps {
  backToTop: GridScrollToTopFunc;
}

export interface GridRenderItemInfo<ItemT> extends ListRenderItemInfo<ItemT> {
  totalColumns: number;
  columns: number;
}

export type GridRenderItem<ItemT> = (info: GridRenderItemInfo<ItemT>) => React.ReactElement | null;
export type GridRow<ItemT> = GridItem<ItemT | null>[];

export interface GridProps<ItemT>
  extends Pick<
    FlatListProps<ItemT>,
    | 'accessible'
    | 'accessibilityHint'
    | 'accessibilityLabel'
    | 'accessibilityRole'
    | 'style'
    | 'data'
    | 'refreshing'
    | 'refreshControl'
    | 'onRefresh'
    | 'onEndReachedThreshold'
    | 'onEndReached'
    | 'onLayout'
    | 'ListEmptyComponent'
    | 'ListFooterComponent'
    | 'ListFooterComponentStyle'
    | 'ListHeaderComponent'
    | 'ListHeaderComponentStyle'
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
   * @deprecated to be removed in fs12
   */
  listViewProps?: Partial<FlatListProps<GridRow<ItemT>>>;

  /**
   * Whether or not to show a separator between columns in the grid.
   *
   * @deprecated to be removed in fs12
   */
  showColumnSeparators?: boolean;

  /**
   * Style to apply to the separator between columns in the grid.
   */
  columnSeparatorStyle?: StyleProp<ViewStyle>;

  /**
   * Whether or not to show a separator between rows in the grid.
   *
   * @deprecated to be removed in fs12
   */
  showRowSeparators?: boolean;

  /**
   * Style to apply to the separator between rows in the grid.
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
  insertEveryValues?: ItemT | GridItem<ItemT> | (ItemT | GridItem<ItemT>)[];
}

export interface GridState<ItemT> extends Pick<FlatListProps<ItemT[]>, 'data'> {
  /**
   * Whether or not the back to top button is currently visible.
   */
  backToTopVisible: boolean;
}

// TODO: wSedlacek remove deprecated props in fs12
// eslint-disable-next-line complexity
export const Grid = <ItemT,>(props: GridProps<ItemT>) => {
  const {
    accessible,
    accessibilityHint,
    accessibilityLabel,
    accessibilityRole,
    data,
    renderItem,
    BackToTopComponent,
    BackToTopShowAtHeight,
    BackToTopStyle,
    ListEmptyComponent,
    ListFooterComponent,
    ListFooterComponentStyle,
    ListHeaderComponent,
    ListHeaderComponentStyle,
    columnWidthTable,
    columnSeparatorStyle,
    gridContainerStyle,
    insertRows,
    insertAfter,
    insertEveryFrequency,
    insertEveryValues,
    minColumnWidth,
    numColumns,
    onEndReached,
    onEndReachedThreshold,
    onLayout,
    onRefresh,
    refreshControl,
    refreshing,
    rowSeparatorStyle,
    style,
    backToTopButtonStyle,
    backToTopContainerStyle,
    backToTopShowAtHeight,
    backToTopText,
    backToTopTextStyle,
    columns,
    listViewProps,
    renderBackToTopButton,
    renderFooter,
    renderHeader,
    showBackToTop,
    showColumnSeparators,
    showRowSeparators,
  } = props;

  const listView = useRef<FlatList<GridRow<ItemT>>>(null);
  const [width, setWidth] = useState<number | undefined>(() => {
    const containerWidth = StyleSheet.flatten([gridContainerStyle]).width;
    if (typeof containerWidth === 'number') {
      return containerWidth;
    }

    const gridWidth = StyleSheet.flatten([style]).width;
    if (typeof gridWidth === 'number') {
      return gridWidth;
    }

    return undefined;
  });
  const [backTopOpacity] = useState(new Animated.Value(0));
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  const totalColumns = useMemo(() => {
    if (typeof numColumns !== 'number' || columns !== undefined) {
      if (width) {
        const calculatedColumns = Math.floor(width / (minColumnWidth ?? DEFAULT_MIN_COLUMNS));

        return Math.max(calculatedColumns, 1);
      } else {
        return 0;
      }
    } else {
      return columns ?? numColumns ?? DEFAULT_COLUMNS;
    }
  }, [columns, numColumns, minColumnWidth, width]);

  const chunkOptions = useMemo<ChunkOptions<ItemT, null>>(
    () => ({
      widthTable: columnWidthTable,
      insertRows,
      insertAfter,
      insertEvery:
        insertEveryFrequency && insertEveryValues
          ? { frequency: insertEveryFrequency, values: insertEveryValues }
          : undefined,
      emptyValue: null,
    }),
    [columnWidthTable, insertRows, insertAfter, insertEveryFrequency, insertEveryValues]
  );
  const chunkedData = useGridChunks(data ?? [], totalColumns, chunkOptions);
  const chunkedArray = useMemo(() => Array.from(chunkedData), [chunkedData]);

  const handleBackToTop = useCallback(() => {
    listView.current?.scrollToOffset({ offset: 0 });
  }, [listView]);

  const handleScroll = useCallback(
    (event?: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (event) {
        const scrollY = event.nativeEvent.contentOffset.y;
        const threshold =
          BackToTopShowAtHeight ?? backToTopShowAtHeight ?? DEFAULT_BACK_TOP_BUTTON_SHOW_AT_HEIGHT;

        if (scrollY > threshold && !backToTopVisible) {
          setBackToTopVisible(true);
          Animated.timing(backTopOpacity, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        } else if (scrollY < threshold && backToTopVisible) {
          setBackToTopVisible(false);
          Animated.timing(backTopOpacity, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    },
    [
      backTopOpacity,
      BackToTopShowAtHeight,
      backToTopShowAtHeight,
      backToTopVisible,
      setBackToTopVisible,
    ]
  );

  const renderRow = useCallback<ListRenderItem<GridRow<ItemT>>>(
    ({ index, item, separators }) => {
      const showRowSeparator = chunkedArray?.length > index + 1;
      const columnWidth = 100 / totalColumns;

      return (
        <View style={gridStyle.row}>
          {item.map((item, index) => {
            const columns = getAbsoluteWidth(item.width, totalColumns);
            const widthPercent = Math.floor(columnWidth * columns * 100) / 100;
            const showColumnSeparator = (index + 1) % totalColumns !== 0;

            return (
              <View key={index} style={[gridStyle.item, { width: widthPercent + '%' }]}>
                <View style={gridStyle.itemRow}>
                  {item.value &&
                    renderItem &&
                    renderItem({
                      item: item.value,
                      index,
                      separators,
                      totalColumns,
                      columns,
                    })}
                  {(showRowSeparators || rowSeparatorStyle) && showRowSeparator && (
                    <View style={[gridStyle.rowSeparator, rowSeparatorStyle]} />
                  )}
                </View>
                {(showColumnSeparators || columnSeparatorStyle) && showColumnSeparator && (
                  <View style={[gridStyle.columnSeparator, columnSeparatorStyle]} />
                )}
              </View>
            );
          })}
        </View>
      );
    },
    [
      chunkedArray,
      totalColumns,
      renderItem,
      showRowSeparators,
      rowSeparatorStyle,
      showColumnSeparators,
      columnSeparatorStyle,
    ]
  );

  const rerenderTrigger = useMemo(() => {
    return Symbol('This is used to mark a change that requires a rerender');
  }, [listViewProps?.extraData, renderRow]);

  return (
    <View style={gridContainerStyle}>
      <FlatList
        ref={listView}
        accessible={accessible}
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        data={chunkedArray}
        renderItem={renderRow}
        keyExtractor={DEFAULT_KEY_EXTRACTOR}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent ?? renderFooter}
        ListFooterComponentStyle={ListFooterComponentStyle}
        ListHeaderComponent={ListHeaderComponent ?? renderHeader}
        ListHeaderComponentStyle={ListHeaderComponentStyle}
        style={style}
        refreshControl={refreshControl}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onScroll={showBackToTop || BackToTopComponent ? handleScroll : undefined}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onLayout={onLayout}
        onContentSizeChange={setWidth}
        extraData={rerenderTrigger}
        {...listViewProps}
      />
      {(showBackToTop || BackToTopComponent) && (
        <Animated.View
          style={[
            gridStyle.scrollTopButtonContainer,
            { opacity: backTopOpacity },
            BackToTopStyle ?? backToTopContainerStyle,
          ]}
        >
          {isValidElement(BackToTopComponent) ? (
            BackToTopComponent
          ) : BackToTopComponent ? (
            <BackToTopComponent backToTop={handleBackToTop} />
          ) : renderBackToTopButton ? (
            renderBackToTopButton(handleBackToTop)
          ) : (
            <TouchableOpacity
              style={[gridStyle.scrollTopButton, backToTopButtonStyle]}
              onPress={handleBackToTop}
            >
              <Text style={backToTopTextStyle}>{backToTopText ?? 'Top'}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </View>
  );
};
