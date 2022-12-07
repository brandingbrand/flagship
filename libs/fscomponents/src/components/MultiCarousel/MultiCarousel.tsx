import React, {
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {
  Animated,
  Easing,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { PageIndicator } from '../PageIndicator';

import type { GoToOptions } from './CarouselController';
import type { MultiCarouselProps } from './MultiCarouselProps';

const DEFAULT_PEEK_SIZE = 0;
const DEFAULT_ITEMS_PER_PAGE = 'auto';
const DEFAULT_ITEM_WIDTH = 175;
const DEFAULT_PAGE_INDICATOR_COMPONENT = PageIndicator;
const DEFAULT_KEY_EXTRACTOR = <ItemT extends { key?: string; id?: string }>(
  item: ItemT,
  index: number
) => item.key ?? item.id ?? `${index}`;

const styles = StyleSheet.create({
  buttonNextIcon: {
    borderColor: 'black',
    borderRightWidth: 2,
    borderTopWidth: 2,
    height: 25,
    transform: [
      {
        rotate: '45deg',
      },
    ],
    width: 25,
  },
  buttonPrevIcon: {
    borderColor: 'black',
    borderLeftWidth: 2,
    borderTopWidth: 2,
    height: 25,
    transform: [
      {
        rotate: '-45deg',
      },
    ],
    width: 25,
  },
  container: {
    overflow: 'hidden',
  },
  goToNext: {
    marginTop: -15,
    padding: 10,
    position: 'absolute',
    right: 0,
    top: '50%',
    zIndex: 100,
  },
  goToPrev: {
    left: 0,
    marginTop: -15,
    padding: 10,
    position: 'absolute',
    top: '50%',
    zIndex: 100,
  },
});

// eslint-disable-next-line max-lines-per-function, max-statements
export const MultiCarousel = <ItemT,>(props: MultiCarouselProps<ItemT>) => {
  const {
    accessible,
    accessibilityHint,
    accessibilityLabel,
    accessibilityRole,
    autoplay,
    autoplayTimeoutDuration = 5000,
    data,
    renderItem,
    PageIndicatorComponent = DEFAULT_PAGE_INDICATOR_COMPONENT,
    keyExtractor = DEFAULT_KEY_EXTRACTOR,
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
    itemWidth = DEFAULT_ITEM_WIDTH,
    peekSize = DEFAULT_PEEK_SIZE,
    carouselController,
    centerMode,
    contentContainerStyle,
    dotActiveStyle,
    dotStyle,
    itemStyle,
    itemsAreEqual,
    nextArrowContainerStyle,
    nextArrowStyle,
    nextArrowOnBlur,
    onSlideChange,
    pageIndicatorStyle,
    prevArrowContainerStyle,
    prevArrowStyle,
    prevArrowOnBlur,
    showArrow,
    style,
    dataSet,
    itemUpdated,
    hidePageIndicator,
    renderPageIndicator,
  } = props;

  const scrollView = useRef<FlatList<ItemT>>(null);

  const shouldAnimate = Boolean(itemUpdated) || Boolean(itemsAreEqual);
  const [opacity] = useState(() => new Animated.Value(shouldAnimate ? 0 : 1));

  const [prevData, setPrevData] = useState(data);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [initialScrollX, setInitialScrollX] = useState<number>();
  const autoplayTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [shouldPlay, setShouldPlay] = useState(true);

  const calculatedItemsPerPage = useMemo(() => {
    if (typeof itemsPerPage === 'number') {
      if (itemsPerPage <= 0) {
        console.error(
          `${MultiCarousel.name}: itemsPerPage must be greater than 0, received ${itemsPerPage}`
        );
        return 1;
      }

      return itemsPerPage;
    }

    if (!containerWidth) {
      return 1;
    }

    return Math.floor(containerWidth / itemWidth);
  }, [itemsPerPage, itemWidth, containerWidth]);

  const calculatedPeekSize = useMemo(
    () => (itemsPerPage === 'auto' ? containerWidth % itemWidth : peekSize),
    [itemsPerPage, containerWidth, itemWidth, peekSize]
  );

  const numberOfPages = useMemo(
    () => Math.ceil((data?.length ?? 0) / Math.floor(calculatedItemsPerPage)),
    [data, calculatedItemsPerPage]
  );

  const calculatedItemWidth = useMemo(() => {
    if (peekSize && !Number.isInteger(peekSize * 2)) {
      console.error(
        `${MultiCarousel.name}: (peekSize * 2) must be an integer but got (${peekSize} * 2)`
      );
    }

    return itemsPerPage === 'auto'
      ? itemWidth
      : (containerWidth - calculatedPeekSize * (centerMode ? 2 : 1)) / calculatedItemsPerPage;
  }, [
    peekSize,
    itemsPerPage,
    itemWidth,
    containerWidth,
    calculatedPeekSize,
    centerMode,
    calculatedItemsPerPage,
  ]);

  const snapToInterval = useMemo(
    () => calculatedItemWidth * Math.floor(calculatedItemsPerPage),
    [calculatedItemWidth, calculatedItemsPerPage]
  );

  const pageWidth = useMemo(
    () => calculatedItemWidth * Math.floor(calculatedItemsPerPage),
    [calculatedItemWidth, calculatedItemsPerPage]
  );

  useLayoutEffect(() => {
    if (shouldAnimate) {
      Animated.timing(opacity, {
        toValue: 1,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [opacity, shouldAnimate]);

  useLayoutEffect(() => {
    if (data && data.length <= currentIndex) {
      setCurrentIndex(data.length);
    }
  }, [data, currentIndex, setCurrentIndex]);

  useEffect(() => {
    const prevItem = prevData?.[currentIndex];
    const nextItem = data?.[currentIndex];

    if (prevItem !== nextItem) {
      const runAnimation = () => {
        opacity.setValue(0);
        Animated.timing(opacity, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      };

      if (itemsAreEqual) {
        if (itemsAreEqual(prevItem, nextItem)) {
          runAnimation();
        }
      } else {
        itemUpdated?.(prevItem, nextItem, currentIndex, runAnimation);
      }
    }

    setPrevData(data);
  }, [data, prevData, currentIndex, itemUpdated, setPrevData]);

  const renderItemContainer = useCallback(
    (info: ListRenderItemInfo<ItemT>) => (
      <View
        key={keyExtractor(info.item, info.index)}
        style={[{ width: calculatedItemWidth }, itemStyle]}
      >
        {renderItem?.(info)}
      </View>
    ),
    [renderItem, itemStyle, calculatedItemWidth, keyExtractor]
  );

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      setContainerWidth(e.nativeEvent.layout.width);
    },
    [containerWidth, setContainerWidth]
  );

  const goTo = useCallback(
    async (nextIndex: number, { animated = true }: GoToOptions = {}) => {
      if (scrollView.current) {
        scrollView.current.scrollToOffset({
          offset: nextIndex * pageWidth,
          animated,
        });
      }
    },
    [currentIndex, pageWidth, setCurrentIndex, onSlideChange]
  );

  const goToNext = useCallback(
    async (options?: GestureResponderEvent | GoToOptions) => {
      const nextIndex = currentIndex + 1 > numberOfPages - 1 ? 0 : currentIndex + 1;
      await goTo(nextIndex, options && 'animated' in options ? options : undefined);
    },
    [goTo, currentIndex, numberOfPages]
  );

  const goToPrev = useCallback(
    async (options?: GestureResponderEvent | GoToOptions) => {
      const nextIndex = currentIndex - 1 < 0 ? 0 : currentIndex - 1;

      await goTo(nextIndex, options && 'animated' in options ? options : undefined);
    },
    [goTo, currentIndex]
  );

  const goToOrigin = useCallback(
    async (options?: GoToOptions) => {
      await goTo(currentIndex, options);
    },
    [goTo, currentIndex]
  );

  const stopCarouselLooping = (): void => {
    if (autoplayTimeout.current) {
      clearTimeout(autoplayTimeout.current);
    }
    setShouldPlay(false);
  };

  const goToNextCancelCarousel = useCallback(async () => {
    stopCarouselLooping();
    await goToNext();
  }, [goToNext]);

  const goToPrevCancelCarousel = useCallback(async () => {
    stopCarouselLooping();
    await goToPrev();
  }, [goToPrev]);

  useEffect(() => {
    if (pageWidth && autoplay && numberOfPages > 0 && shouldPlay) {
      autoplayTimeout.current = setTimeout(async () => {
        const options = {
          animated: true,
        };
        // Animation is hardcoded at 200ms; stop animation to avoid glitch.
        if (autoplayTimeoutDuration <= 300) {
          options.animated = false;
        }
        await goToNext(options);
      }, autoplayTimeoutDuration);
      return () => {
        if (autoplayTimeout.current) {
          clearTimeout(autoplayTimeout.current);
        }
      };
    }
    return undefined;
  }, [
    numberOfPages,
    currentIndex,
    autoplay,
    pageWidth,
    shouldPlay,
    autoplayTimeoutDuration,
    goToNext,
  ]);

  useEffect(() => {
    carouselController?.({
      goTo,
      goToNext,
      goToPrev,
      goToOrigin,
    });
  }, [carouselController, goTo, goToNext, goToPrev, goToOrigin]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index =
        Math.round(e.nativeEvent.contentOffset.x + pageWidth + calculatedPeekSize) >=
        Math.round(e.nativeEvent.contentSize.width)
          ? numberOfPages - 1
          : Math.round(Math.round(e.nativeEvent.contentOffset.x) / snapToInterval);
      const nextIndex = Math.min(Math.max(0, index), numberOfPages - 1);

      if (currentIndex !== nextIndex) {
        onSlideChange?.({
          currentIndex,
          nextIndex,
        });
      }

      setCurrentIndex(nextIndex);
    },
    [currentIndex, snapToInterval, calculatedPeekSize, numberOfPages, setCurrentIndex]
  );

  const handleScrollBeginDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (Platform.OS !== 'android') {
        return;
      }

      setInitialScrollX(e.nativeEvent.contentOffset.x);
    },
    [setInitialScrollX]
  );

  const handleScrollEndDrag = useCallback(
    async (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (
        Platform.OS !== 'android' ||
        typeof initialScrollX !== 'number' ||
        !e.nativeEvent.velocity
      ) {
        return;
      }

      const diffX = e.nativeEvent.contentOffset.x - initialScrollX;

      if (diffX > 80 || e.nativeEvent.velocity.x < -0.5) {
        await goToNext();
      } else if (diffX < -80 || e.nativeEvent.velocity.x > 0.5) {
        await goToPrev();
      } else {
        await goToOrigin();
      }
    },
    [initialScrollX, goToNext, goToPrev, goToOrigin]
  );

  if (!data) {
    return null;
  }

  if (data.length <= 1) {
    return (
      <View onLayout={handleLayout} style={[{ alignItems: 'center' }, style]}>
        <View style={[{ width: calculatedItemWidth }, itemStyle]}>
          {data[0]
            ? renderItem?.({
                item: data[0],
                index: 0,
                separators: {
                  highlight: () => undefined,
                  unhighlight: () => undefined,
                  updateProps: () => undefined,
                },
              })
            : null}
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, style, { opacity }]}>
      <FlatList
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        accessible={accessible}
        contentContainerStyle={contentContainerStyle}
        data={data}
        decelerationRate={0}
        horizontal
        keyExtractor={keyExtractor}
        onLayout={handleLayout}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        ref={scrollView}
        renderItem={renderItemContainer}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={snapToInterval}
        {...{ dataSet }}
      />

      {hidePageIndicator ? null : renderPageIndicator ? (
        renderPageIndicator(currentIndex, data.length)
      ) : isValidElement(PageIndicatorComponent) ? (
        PageIndicatorComponent
      ) : (
        <PageIndicatorComponent
          currentIndex={currentIndex}
          dotActiveStyle={dotActiveStyle}
          dotStyle={dotStyle}
          itemsCount={numberOfPages}
          style={pageIndicatorStyle}
        />
      )}

      {currentIndex !== 0 && Boolean(showArrow) && (
        <TouchableOpacity
          accessibilityLabel={FSI18n.string(translationKeys.flagship.multiCarousel.prevBtn)}
          accessibilityRole="button"
          onBlur={prevArrowOnBlur}
          onPress={goToPrevCancelCarousel}
          style={[styles.goToPrev, prevArrowContainerStyle]}
        >
          <View style={[styles.buttonPrevIcon, prevArrowStyle]} />
        </TouchableOpacity>
      )}

      {currentIndex !== numberOfPages - 1 && Boolean(showArrow) && (
        <TouchableOpacity
          accessibilityLabel={FSI18n.string(translationKeys.flagship.multiCarousel.nextBtn)}
          accessibilityRole="button"
          onBlur={nextArrowOnBlur}
          onPress={goToNextCancelCarousel}
          style={[styles.goToNext, nextArrowContainerStyle]}
        >
          <View style={[styles.buttonNextIcon, nextArrowStyle]} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};
