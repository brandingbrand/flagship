import type { GridProps } from './GridProps';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { useGridItems } from './hooks';
import { ChunkOptions, InsertOptions, KeysOptions, SizeOptions, Width } from './utils';
import { DEFAULT_BACK_TOP_BUTTON_SHOW_AT_HEIGHT, DEFAULT_MIN_COLUMNS } from './defaults';

const styles = StyleSheet.create({
  grid: {
    display: 'grid' as 'flex',
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

const fixedColumnStyles = (numColumns: number) => {
  return { gridTemplateColumns: `repeat(${numColumns}, 1fr)` } as ViewStyle;
};

const columnSizeStyles = (minColumnWidth: number, autoFit?: boolean) => {
  return {
    gridTemplateColumns: `repeat(${
      autoFit ? 'auto-fit' : 'auto-fill'
    }, minmax(${minColumnWidth}px, 1fr))`,
  } as ViewStyle;
};

const fixedRowStyles = (row: number | string) => {
  return { gridColumnStart: '1', gridColumnEnd: '-1', gridRowStart: row } as ViewStyle;
};

const gridItemSizeStyles = (size: Width) => {
  if (typeof size === 'number') {
    // TODO: Fix grid blow out when grid is smaller than span provided
    return { gridColumn: `span ${size}` } as ViewStyle;
  } else {
    return { gridColumn: '1 / -1' } as ViewStyle;
  }
};

const separators = {
  highlight: () => {},
  unhighlight: () => {},
  updateProps: () => {},
};

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
  } = props;

  const scrollView = useRef<ScrollView>(null);
  const [backTopOpacity] = useState(new Animated.Value(0));
  const backToTopVisible = useRef(false);

  const definitionOptions = useMemo<
    ChunkOptions<ItemT, null> & InsertOptions<ItemT> & SizeOptions & KeysOptions
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
  const gridItems = useMemo(() => Array.from(iterator), [iterator]);

  const scrollRefreshController = useMemo(() => {
    if (refreshControl) return refreshControl;
    if (onRefresh) return <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh} />;
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
    <View style={gridContainerStyle}>
      <ScrollView
        accessible={accessible}
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        contentContainerStyle={[
          style,
          styles.grid,
          numColumns === 'auto'
            ? columnSizeStyles(minColumnWidth, autoFit)
            : fixedColumnStyles(columns ?? numColumns),
        ]}
        refreshControl={scrollRefreshController}
        onLayout={onLayout}
        onScroll={handleScroll}
        {...{ dataSet }}
      >
        {ListHeaderComponent && (
          <View style={[ListHeaderComponentStyle, gridItemSizeStyles('fill')]}>
            {React.isValidElement(ListHeaderComponent) ? (
              ListHeaderComponent
            ) : (
              <ListHeaderComponent />
            )}
          </View>
        )}
        {/* deprecated */}
        {renderHeader && (
          <View style={[ListHeaderComponentStyle, gridItemSizeStyles('fill')]}>
            {renderHeader()}
          </View>
        )}

        {gridItems.length ? (
          <>
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
          </>
        ) : ListEmptyComponent ? (
          React.isValidElement(ListEmptyComponent) ? (
            ListEmptyComponent
          ) : (
            <ListEmptyComponent />
          )
        ) : null}

        {ListFooterComponent && (
          <View style={[ListFooterComponentStyle, gridItemSizeStyles('fill')]}>
            {React.isValidElement(ListFooterComponent) ? (
              ListFooterComponent
            ) : (
              <ListFooterComponent />
            )}
          </View>
        )}
        {/* deprecated */}
        {renderFooter && (
          <View style={[ListFooterComponentStyle, gridItemSizeStyles('fill')]}>
            {renderFooter()}
          </View>
        )}
      </ScrollView>

      {(showBackToTop || BackToTopComponent) && (
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
              style={[styles.scrollTopButton, backToTopButtonStyle]}
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
