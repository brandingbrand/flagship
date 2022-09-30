import React, { useCallback, useMemo, useRef, useState } from 'react';

import type { NativeScrollEvent, NativeSyntheticEvent, ViewStyle } from 'react-native';
import {
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { GridProps } from './GridProps';
import { DEFAULT_BACK_TOP_BUTTON_SHOW_AT_HEIGHT, DEFAULT_MIN_COLUMNS } from './defaults';
import { useGridItems } from './hooks';
import type { ChunkOptions, InsertOptions, KeysOptions, SizeOptions, Width } from './utils';

const styles = StyleSheet.create({
  grid: {
    display: 'grid' as 'flex',
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

// columnGap and rowGap are valid React css properties, but the React Native props do not take this into account
const gridGutterStyles = (columnGap?: number, rowGap?: number): ViewStyle =>
  ({
    columnGap,
    rowGap,
  } as unknown as ViewStyle);

const fixedColumnStyles = (numColumns: number) =>
  ({ gridTemplateColumns: `repeat(${numColumns}, 1fr)` } as ViewStyle);

const columnSizeStyles = (minColumnWidth: number, autoFit?: boolean) =>
  ({
    gridTemplateColumns: `repeat(${
      autoFit ? 'auto-fit' : 'auto-fill'
    }, minmax(${minColumnWidth}px, 1fr))`,
  } as ViewStyle);

const fixedRowStyles = (row: number | string) =>
  ({ gridColumnStart: '1', gridColumnEnd: '-1', gridRowStart: row } as ViewStyle);

const gridItemSizeStyles = (size: Width) => {
  if (typeof size === 'number') {
    // TODO: Fix grid blow out when grid is smaller than span provided
    return { gridColumn: `span ${size}` } as ViewStyle;
  }
  return { gridColumn: '1 / -1' } as ViewStyle;
};

const separators = {
  highlight: () => {},
  unhighlight: () => {},
  updateProps: () => {},
};

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
    minColumnWidth = DEFAULT_MIN_COLUMNS,
    numColumns = 'auto',
    onLayout,
    onRefresh,
    refreshControl,
    refreshing,
    style,
    dataSet,
    keyExtractor,
    autoFit,
    backToTopButtonStyle,
    backToTopContainerStyle,
    backToTopShowAtHeight,
    backToTopText,
    backToTopTextStyle,
    columns,
    renderBackToTopButton,
    renderFooter,
    renderHeader,
    showBackToTop,
    columnGap,
    rowGap,
  } = props;

  const scrollView = useRef<ScrollView>(null);
  const [backTopOpacity] = useState(new Animated.Value(0));
  const backToTopVisible = useRef(false);

  const definitionOptions = useMemo<
    ChunkOptions<ItemT, null> & InsertOptions<ItemT> & KeysOptions & SizeOptions
  >(
    () => ({
      widthTable: columnWidthTable,
      insertRows,
      insertAfter,
      insertEvery:
        insertEveryFrequency && insertEveryValues
          ? { frequency: insertEveryFrequency, values: insertEveryValues }
          : undefined,
      emptyValue: null,
      keyExtractor,
    }),
    [
      columnWidthTable,
      insertRows,
      insertAfter,
      insertEveryFrequency,
      insertEveryValues,
      keyExtractor,
    ]
  );

  const { iterator, rowIterator } = useGridItems(data ?? [], definitionOptions);
  const gridItems = useMemo(() => [...iterator], [iterator]);

  const scrollRefreshController = useMemo(() => {
    if (refreshControl) {
      return refreshControl;
    }
    if (onRefresh) {
      return <RefreshControl onRefresh={onRefresh} refreshing={refreshing ?? false} />;
    }
    return undefined;
  }, [onRefresh, refreshControl, refreshing]);

  const handleScroll = useCallback(
    (event?: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (event) {
        const scrollY = event.nativeEvent.contentOffset.y;
        const threshold =
          BackToTopShowAtHeight ?? backToTopShowAtHeight ?? DEFAULT_BACK_TOP_BUTTON_SHOW_AT_HEIGHT;

        if (scrollY > threshold && !backToTopVisible.current) {
          backToTopVisible.current = true;
          Animated.timing(backTopOpacity, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        } else if (scrollY < threshold && backToTopVisible.current) {
          backToTopVisible.current = false;
          Animated.timing(backTopOpacity, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    },
    [backTopOpacity, BackToTopShowAtHeight, backToTopShowAtHeight, backToTopVisible]
  );

  const handleBackToTop = useCallback(() => {
    scrollView.current?.scrollTo({ y: 0, x: 0 });
  }, [scrollView]);

  return (
    <View style={gridContainerStyle} {...{ dataSet }}>
      <ScrollView
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        accessible={accessible}
        contentContainerStyle={[
          style,
          styles.grid,
          gridGutterStyles(columnGap, rowGap),
          numColumns === 'auto'
            ? columnSizeStyles(minColumnWidth, autoFit)
            : fixedColumnStyles(columns ?? numColumns),
        ]}
        onLayout={onLayout}
        onScroll={handleScroll}
        refreshControl={scrollRefreshController}
      >
        {ListHeaderComponent ? (
          <View style={[ListHeaderComponentStyle, gridItemSizeStyles('fill')]}>
            {React.isValidElement(ListHeaderComponent) ? (
              ListHeaderComponent
            ) : (
              <ListHeaderComponent />
            )}
          </View>
        ) : null}
        {/* deprecated */}
        {renderHeader ? (
          <View style={[ListHeaderComponentStyle, gridItemSizeStyles('fill')]}>
            {renderHeader()}
          </View>
        ) : null}

        {gridItems.length > 0 ? (
          <React.Fragment>
            {gridItems.map((item, index) => (
              <View key={item.key} style={gridItemSizeStyles(item.width)}>
                {renderItem({
                  item: item.value,
                  index,
                  separators,
                })}
              </View>
            ))}
            {rowIterator.map(([row, item], index) => (
              <View key={item.key} style={fixedRowStyles(row)}>
                {renderItem({
                  item: item.value,
                  index,
                  separators,
                })}
              </View>
            ))}
          </React.Fragment>
        ) : ListEmptyComponent ? (
          React.isValidElement(ListEmptyComponent) ? (
            ListEmptyComponent
          ) : (
            <ListEmptyComponent />
          )
        ) : null}

        {ListFooterComponent ? (
          <View style={[ListFooterComponentStyle, gridItemSizeStyles('fill')]}>
            {React.isValidElement(ListFooterComponent) ? (
              ListFooterComponent
            ) : (
              <ListFooterComponent />
            )}
          </View>
        ) : null}
        {/* deprecated */}
        {renderFooter ? (
          <View style={[ListFooterComponentStyle, gridItemSizeStyles('fill')]}>
            {renderFooter()}
          </View>
        ) : null}
      </ScrollView>

      {showBackToTop || BackToTopComponent ? (
        <Animated.View
          style={[
            styles.scrollTopButtonContainer,
            { opacity: backTopOpacity },
            BackToTopStyle ?? backToTopContainerStyle,
          ]}
        >
          {React.isValidElement(BackToTopComponent) ? (
            BackToTopComponent
          ) : BackToTopComponent ? (
            <BackToTopComponent backToTop={handleBackToTop} />
          ) : renderBackToTopButton ? (
            renderBackToTopButton(handleBackToTop)
          ) : (
            <TouchableOpacity
              onPress={handleBackToTop}
              style={[styles.scrollTopButton, backToTopButtonStyle]}
            >
              <Text style={backToTopTextStyle}>{backToTopText ?? 'Top'}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      ) : null}
    </View>
  );
};
