import React, { isValidElement, useCallback, useMemo, useRef, useState } from 'react';

import type { ListRenderItem, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { GridProps, GridRow } from './GridProps';
import {
  DEFAULT_BACK_TOP_BUTTON_SHOW_AT_HEIGHT,
  DEFAULT_COLUMNS,
  DEFAULT_KEY_EXTRACTOR,
  DEFAULT_MIN_COLUMNS,
} from './defaults';
import { useGridChunks } from './hooks';
import type { ChunkOptions, InsertOptions, SizeOptions } from './utils';
import { getAbsoluteWidth } from './utils';

const gridStyle = StyleSheet.create({
  columnSeparator: {
    backgroundColor: '#8E8E8E',
    height: '100%',
    width: 1,
  },
  item: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  itemRow: {
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  rowSeparator: {
    backgroundColor: '#8E8E8E',
    height: 1,
    width: '100%',
  },
  scrollTopButton: {
    backgroundColor: '#eee',
    padding: 10,
  },
  scrollTopButtonContainer: {
    bottom: 30,
    position: 'absolute',
    right: 30,
    zIndex: 200,
  },
});

// eslint-disable-next-line max-lines-per-function
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
      }
      return 0;
    }
    return columns ?? numColumns ?? DEFAULT_COLUMNS;
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
  const chunkedArray = useMemo(() => [...chunkedData], [chunkedData]);

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
      const showRowSeparator = chunkedArray.length > index + 1;
      const columnWidth = 100 / totalColumns;

      return (
        <View style={gridStyle.row}>
          {item.map((item, index) => {
            const columns = getAbsoluteWidth(item.width, totalColumns);
            const widthPercent = Math.floor(columnWidth * columns * 100) / 100;
            const showColumnSeparator = (index + 1) % totalColumns !== 0;

            return (
              <View key={index} style={[gridStyle.item, { width: `${widthPercent}%` }]}>
                <View style={gridStyle.itemRow}>
                  {item.value && renderItem
                    ? renderItem({
                        item: item.value,
                        index,
                        totalColumns,
                        columns,
                        separators,
                      })
                    : null}
                  {(showRowSeparators || rowSeparatorStyle) && showRowSeparator ? (
                    <View style={[gridStyle.rowSeparator, rowSeparatorStyle]} />
                  ) : null}
                </View>
                {(showColumnSeparators || columnSeparatorStyle) && showColumnSeparator ? (
                  <View style={[gridStyle.columnSeparator, columnSeparatorStyle]} />
                ) : null}
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

  const rerenderTrigger = useMemo(
    () => Symbol('This is used to mark a change that requires a rerender'),
    [listViewProps?.extraData, renderRow]
  );

  return (
    <View style={gridContainerStyle}>
      <FlatList
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent ?? renderFooter}
        ListFooterComponentStyle={ListFooterComponentStyle}
        ListHeaderComponent={ListHeaderComponent ?? renderHeader}
        ListHeaderComponentStyle={ListHeaderComponentStyle}
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        accessible={accessible}
        data={chunkedArray}
        extraData={rerenderTrigger}
        keyExtractor={keyExtractor}
        onContentSizeChange={setWidth}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onLayout={onLayout}
        onRefresh={onRefresh}
        onScroll={showBackToTop || BackToTopComponent ? handleScroll : undefined}
        ref={listView}
        refreshControl={refreshControl}
        refreshing={refreshing}
        renderItem={renderRow}
        style={style}
        {...listViewProps}
        {...{ dataSet }}
      />
      {showBackToTop || BackToTopComponent ? (
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
              onPress={handleBackToTop}
              style={[gridStyle.scrollTopButton, backToTopButtonStyle]}
            >
              <Text style={backToTopTextStyle}>{backToTopText ?? 'Top'}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      ) : null}
    </View>
  );
};
