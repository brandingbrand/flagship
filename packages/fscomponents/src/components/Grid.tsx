import React, {
  ComponentType,
  isValidElement,
  ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Animated,
  FlatList,
  FlatListProps,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { chunk } from 'lodash-es';

const DEFAULT_COLUMNS = 2;
const DEFAULT_BACK_TOP_BUTTON_SHOW_AT_HEIGHT = 100;
const DEFAULT_KEY_EXTRACTOR = <ItemT, >(items: ItemT[], index: number): string => {
  const key = items
    .map((item: ItemT & { id?: string; key?: string }) => item?.key ?? item?.id)
    .filter(Boolean)
    .join();

  return key || `${index}`;
};

const gridStyle = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  item: {
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  itemRow: {
    flex: 1,
    justifyContent: 'space-between'
  },
  rowSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#8E8E8E'
  },
  columnSeparator: {
    height: '100%',
    width: 1,
    backgroundColor: '#8E8E8E'
  },
  scrollTopButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 200
  },
  scrollTopButton: {
    backgroundColor: '#eee',
    padding: 10
  }
});

export type GridScrollToTopFunc = () => void;
export interface BackToTopComponentProps {
  backToTop: GridScrollToTopFunc;
}

export interface GridProps<ItemT>
  extends Pick<
    FlatListProps<ItemT>,
    | 'style'
    | 'data'
    | 'renderItem'
    | 'numColumns'
    | 'refreshing'
    | 'refreshControl'
    | 'onRefresh'
    | 'onEndReachedThreshold'
    | 'onEndReached'
    | 'ListEmptyComponent'
    | 'ListFooterComponent'
    | 'ListFooterComponentStyle'
    | 'ListHeaderComponent'
    | 'ListHeaderComponentStyle'
  > {
  /**
   * The number of columns to display in the grid. Defaults to 2.
   * @deprecated to be removed in fs12, use numColumns instead
   */
  columns?: number;

  /**
   * Whether or not a back to top button should appear after the user scrolls down. Defaults to
   * false.
   * @deprecated to be removed in fs12, use BackToTopButton instead
   */
  showBackToTop?: boolean;

  /**
   * An optional function to render a header component displayed at the top of the grid.
   * @deprecated to be removed in fs12, use ListHeaderComponent instead
   */
  renderHeader?: () => JSX.Element | null;

  /**
   * An optional function to render a footer component, displayed at the bottom of the grid.
   * @deprecated to be removed in fs12, use ListFooterComponent instead
   */
  renderFooter?: () => JSX.Element | null;

  /**
   * Styles to apply to the container around the back to top button
   * @deprecated to be removed in fs12, use BackToTopStyle instead
   */
  backToTopContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Styles to apply to the back to top button. Does not apply if a custom back to top render
   * function is used.
   * @deprecated to be removed in fs12, use BackToTopButton instead
   */
  backToTopButtonStyle?: StyleProp<ViewStyle>;

  /**
   * Styles to apply to the default back to top text. Does not apply if a custom back to top render
   * function is used.
   * @deprecated to be removed in fs12, use BackToTopButton instead
   */
  backToTopTextStyle?: StyleProp<TextStyle>;

  /**
   * Copy to show inside the back to top button. Defaults to "Top". Does not apply if a custom back
   * to top render function is used.
   * @deprecated to be removed in fs12, use BackToTopButton instead
   */
  backToTopText?: string;

  /**
   * The distance the user needs to scroll down before the back to top button appears. Defaults to
   * 100.
   * @deprecated to be removed in fs12, use BackToTopShowAtHeight instead
   */
  backToTopShowAtHeight?: number;

  /**
   * An optional custom render function to render a back to top button.
   * @deprecated use BackToTopButton instead
   */
  renderBackToTopButton?: (scrollToTop: GridScrollToTopFunc) => JSX.Element;

  /**
   * Props to pass to the underlying FlatList.
   * @deprecated to be removed in fs12
   */
  listViewProps?: Partial<FlatListProps<ItemT[]>>;

  /**
   * Whether or not to show a separator between columns in the grid.
   * @deprecated to be removed in fs12
   */
  showColumnSeparators?: boolean;

  /**
   * Style to apply to the separator between columns in the grid.
   */
  columnSeparatorStyle?: StyleProp<ViewStyle>;

  /**
   * Whether or not to show a separator between rows in the grid.
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
}

export interface GridState<ItemT> extends Pick<FlatListProps<ItemT[]>, 'data'> {
  /**
   * Whether or not the back to top button is currently visible.
   */
  backToTopVisible: boolean;
}

// TODO: wSedlacek remove deprecated props in fs12
export const Grid = <ItemT, >(props: GridProps<ItemT>) => {
  const {
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
    columnSeparatorStyle,
    gridContainerStyle,
    numColumns,
    onEndReached,
    onEndReachedThreshold,
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
    showRowSeparators
  } = props;

  const listView = useRef<FlatList<ItemT[]>>(null);
  const [backTopOpacity] = useState(new Animated.Value(0));
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  const chunkedData = useMemo(
    () => chunk(data, columns ?? numColumns ?? DEFAULT_COLUMNS),
    [data, columns, numColumns]
  );

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
            useNativeDriver: true
          }).start();
        } else if (scrollY < threshold && backToTopVisible) {
          setBackToTopVisible(false);
          Animated.timing(backTopOpacity, {
            toValue: 0,
            useNativeDriver: true
          }).start();
        }
      }
    },
    [
      backTopOpacity,
      BackToTopShowAtHeight,
      backToTopShowAtHeight,
      backToTopVisible,
      setBackToTopVisible
    ]
  );

  const renderRow = useCallback<ListRenderItem<ItemT[]>>(
    ({ index, item, separators }) => {
      const showRowSeparator = chunkedData?.length > index + 1;

      const totalColumns = columns ?? numColumns ?? DEFAULT_COLUMNS;
      const columnWidth = Math.floor((100 / totalColumns) * 100) / 100;

      return (
        <View style={gridStyle.row}>
          {item.map((item, index) => {
            const showColumnSeparator = (index + 1) % totalColumns !== 0;

            return (
              <View key={index} style={[gridStyle.item, { width: columnWidth + '%' }]}>
                <View style={gridStyle.itemRow}>
                  {renderItem && renderItem({ item, index, separators })}
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
      chunkedData,
      columns,
      numColumns,
      renderItem,
      showRowSeparators,
      rowSeparatorStyle,
      showColumnSeparators,
      columnSeparatorStyle
    ]
  );

  return (
    <View style={gridContainerStyle}>
      <FlatList
        ref={listView}
        data={chunkedData}
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
        {...listViewProps}
      />
      {(showBackToTop || BackToTopComponent) && (
        <Animated.View
          style={[
            gridStyle.scrollTopButtonContainer,
            { opacity: backTopOpacity },
            BackToTopStyle ?? backToTopContainerStyle
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
