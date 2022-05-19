import type { MouseEvent, TouchEvent, UIEvent } from 'react';
import React, {
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { findDOMNode } from 'react-dom';
import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  ListRenderItemInfo,
  ViewStyle,
} from 'react-native';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { animatedScrollTo } from '../../lib/helpers';
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
    data,
    renderItem,
    PageIndicatorComponent = DEFAULT_PAGE_INDICATOR_COMPONENT,
    keyExtractor = DEFAULT_KEY_EXTRACTOR,
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
    itemWidth = DEFAULT_ITEM_WIDTH,
    peekSize = DEFAULT_PEEK_SIZE,
    carouselController,
    centerMode,
    dotActiveStyle,
    dotStyle,
    hideScrollbar,
    itemStyle,
    itemsAreEqual,
    autoplay,
    autoplayTimeoutDuration = 5000,
    nextArrowContainerStyle,
    nextArrowStyle,
    nextArrowOnBlur,
    onSlideChange,
    pageIndicatorStyle,
    prevArrowContainerStyle,
    prevArrowOnBlur,
    prevArrowStyle,
    showArrow,
    style,
    itemUpdated,
    hidePageIndicator,
    hideOverflow,
    renderPageIndicator,
  } = props;

  const scrollView = useRef<HTMLDivElement>(null);
  const autoplayTimeout = useRef<ReturnType<typeof setTimeout>>();

  const shouldAnimate = Boolean(itemUpdated) || Boolean(itemsAreEqual);
  const [opacity] = useState(() => new Animated.Value(shouldAnimate ? 0 : 1));

  const [animating, setAnimating] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [currentScrollX, setCurrentScrollX] = useState(0);
  const [initialScrollX, setInitialScrollX] = useState(0);
  const [initialScrollXTime, setInitialScrollXTime] = useState(0);

  const [prevData, setPrevData] = useState(data);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
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
    [itemsPerPage, peekSize, containerWidth, calculatedItemsPerPage]
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
  }, [itemWidth, containerWidth, calculatedPeekSize, centerMode, calculatedItemsPerPage]);

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

  useLayoutEffect(() => {
    if (scrollView.current) {
      scrollView.current.scrollTo({ left: 0 });
    }
  }, [scrollView.current, containerWidth]);

  const stopCarouselLooping = () => {
    if (autoplayTimeout.current) {
      clearTimeout(autoplayTimeout.current);
    }
    setShouldPlay(false);
  };

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
        style={[{ width: calculatedItemWidth, scrollSnapAlign: 'start' } as ViewStyle, itemStyle]}
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
      const scrollViewElement = findDOMNode(scrollView.current);

      if (scrollViewElement instanceof HTMLElement && !animating) {
        setAnimating(true);
        await animatedScrollTo(scrollViewElement, nextIndex * pageWidth, animated ? 200 : 0)
          .catch((error) => {
            console.warn('animatedScrollTo error', error);
          })
          .finally(() => {
            setAnimating(false);
          });
        // Hacky fix for a hacky Safari release. This fixes a scroll issue
        // on iOS 14.
        setTimeout(() => {
          scrollViewElement.scrollLeft = nextIndex * pageWidth;
        }, 0);
      }
    },
    [animating, currentIndex, pageWidth, setAnimating, onSlideChange]
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

  const goToNextCancelCarousel = async () => {
    stopCarouselLooping();
    await goToNext();
  };

  const goToPrevCancelCarousel = async () => {
    stopCarouselLooping();
    await goToPrev();
  };

  useEffect(() => {
    if (pageWidth && autoplay && numberOfPages > 0 && !animating && shouldPlay) {
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
  }, [numberOfPages, currentIndex, autoplay, animating, pageWidth]);

  useEffect(() => {
    carouselController?.({
      goTo,
      goToNext,
      goToPrev,
      goToOrigin,
    });
  }, [carouselController, goTo, goToNext, goToPrev, goToOrigin]);

  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const index =
        e.currentTarget.scrollLeft + pageWidth + calculatedPeekSize >= e.currentTarget.scrollWidth
          ? numberOfPages - 1
          : Math.round(Math.round(e.currentTarget.scrollLeft) / pageWidth);
      const nextIndex = Math.min(Math.max(0, index), numberOfPages - 1);

      if (currentIndex !== nextIndex) {
        onSlideChange?.({
          currentIndex,
          nextIndex,
        });
      }

      setCurrentIndex(nextIndex);
    },
    [currentIndex, numberOfPages, pageWidth, calculatedPeekSize, setCurrentIndex]
  );

  const handleStart = useCallback(
    (pageX: number) => {
      const scrollViewNode = findDOMNode(scrollView.current);
      if (scrollViewNode instanceof Element) {
        setCurrentScrollX(scrollViewNode.scrollLeft);
      }
      setInitialScrollX(pageX);
      setInitialScrollXTime(Date.now());
      setMouseDown(true);
    },
    [scrollView, setCurrentScrollX, setInitialScrollX, setInitialScrollXTime, setMouseDown]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      stopCarouselLooping();
      handleStart(e.pageX);
    },
    [handleStart]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const firstTouch = e.touches[0];
      if (firstTouch) {
        stopCarouselLooping();
        handleStart(firstTouch.pageX);
      }
    },
    [handleStart]
  );

  const handleEnd = useCallback(
    async (pageX: number) => {
      const dx = initialScrollX - pageX;
      const vx = dx / (initialScrollXTime - Date.now());

      if (dx > 80 || vx < -0.3) {
        await goToNext();
        setMouseDown(false);
      } else if (dx < -80 || vx > 0.3) {
        await goToPrev();
        setMouseDown(false);
      } else {
        await goToOrigin();
        setMouseDown(false);
      }
    },
    [initialScrollX, initialScrollXTime, goToNext, goToPrev, goToOrigin, setMouseDown]
  );

  const handleMouseUp = useCallback(
    async (e: MouseEvent) => {
      await handleEnd(e.pageX);
    },
    [handleEnd]
  );

  const handleTouchEnd = useCallback(
    async (e: TouchEvent) => {
      const firstTouch = e.touches[0];
      if (firstTouch) {
        await handleEnd(firstTouch.pageX);
      } else {
        const pageX = initialScrollX + currentScrollX - (scrollView.current?.scrollLeft || 0);
        await handleEnd(pageX);
      }
    },
    [handleEnd, initialScrollX, currentScrollX, scrollView]
  );

  const handleMove = useCallback(
    (pageX: number) => {
      if (!animating && mouseDown && currentScrollX !== undefined) {
        const dx = initialScrollX - pageX;
        const scrollX = currentScrollX + dx;
        scrollView.current?.scrollTo({
          left: scrollX,
          top: 0,
        });
      }
    },
    [animating, scrollView, mouseDown, initialScrollX, currentScrollX]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.pageX);
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const firstTouch = e.touches[0];
      if (firstTouch) {
        handleMove(firstTouch.pageX);
      }
    },
    [handleMove]
  );

  if (!data) {
    return null;
  }

  if (data.length <= 1) {
    return (
      <View onLayout={handleLayout} style={[{ alignItems: 'center' }, style]}>
        {data[0] &&
          renderItemContainer({
            item: data[0],
            index: 0,
            separators: {
              highlight: () => undefined,
              unhighlight: () => undefined,
              updateProps: () => undefined,
            },
          })}
      </View>
    );
  }

  return (
    <Animated.View onLayout={handleLayout} style={[styles.container, style, { opacity }]}>
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onScroll={handleScroll}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        ref={scrollView}
        style={{
          display: 'flex',
          flexBasis: 'auto',
          flexDirection: 'row',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          overflowX: hideOverflow ?? hideScrollbar ?? true ? 'hidden' : 'scroll',
          scrollSnapType: mouseDown ? undefined : 'x mandatory',
          flexGrow: 1,
        }}
      >
        <View
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole={accessibilityRole}
          accessible={accessible}
          style={{
            width: centerMode ? calculatedPeekSize : 0,
          }}
        />
        {data.map((item, index) =>
          renderItemContainer({
            item,
            index,
            separators: {
              highlight: () => undefined,
              unhighlight: () => undefined,
              updateProps: () => undefined,
            },
          })
        )}
      </div>

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
