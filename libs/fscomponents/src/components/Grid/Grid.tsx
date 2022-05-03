import type { GridProps, GridRow } from './GridProps';

import React, { isValidElement, useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useGridChunks } from './hooks';
import { ChunkOptions, getAbsoluteWidth, InsertOptions, SizeOptions } from './utils';
import {
  DEFAULT_MIN_COLUMNS,
  DEFAULT_COLUMNS,
  DEFAULT_BACK_TOP_BUTTON_SHOW_AT_HEIGHT,
  DEFAULT_KEY_EXTRACTOR,
} from './defaults';

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
    gridContainerStyle,
    insertRows,
    insertAfter,
    insertEveryFrequency,
    insertEveryValues,
    minColumnWidth,
    numColumns,
    onLayout,
    onRefresh,
    refreshControl,
    refreshing,
    style,
    dataSet,
    keyExtractor = DEFAULT_KEY_EXTRACTOR,
    autoFit,
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
    columnSeparatorStyle,
    showRowSeparators,
    rowSeparatorStyle,
    onEndReached,
    onEndReachedThreshold,
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

  const chunkOptions = useMemo<ChunkOptions<ItemT, null> & InsertOptions<ItemT> & SizeOptions>(
    () => ({
      widthTable: columnWidthTable,
      insertRows,
      insertAfter,
      insertEvery:
        insertEveryFrequency && insertEveryValues
          ? { frequency: insertEveryFrequency, values: insertEveryValues }
          : undefined,
      emptyValue: null,
      autoFit,
    }),
    [columnWidthTable, insertRows, insertAfter, insertEveryFrequency, insertEveryValues, autoFit]
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
    ({ index, separators, item }) => {
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
                      totalColumns,
                      columns,
                      separators,
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
        keyExtractor={keyExtractor}
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
        {...{ dataSet }}
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
