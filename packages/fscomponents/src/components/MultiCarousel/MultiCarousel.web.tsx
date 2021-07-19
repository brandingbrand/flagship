import React, {
  isValidElement,
  MouseEvent,
  TouchEvent,
  UIEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { findDOMNode } from 'react-dom';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { animatedScrollTo } from '../../lib/helpers';

import { PageIndicator } from '../PageIndicator';
import { MultiCarouselProps } from './MultiCarouselProps';

const DEFAULT_PEEK_SIZE = 0;
const DEFAULT_ITEMS_PER_PAGE = 2;
const DEFAULT_PAGE_INDICATOR_COMPONENT = PageIndicator;
const DEFAULT_KEY_EXTRACTOR = <ItemT extends { key?: string; id?: string }>(
  item: ItemT,
  index: number
) => {
  return item?.key ?? item?.id ?? `${index}`;
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  goToNext: {
    position: 'absolute',
    top: '50%',
    right: 0,
    zIndex: 100,
    marginTop: -15,
    padding: 10
  },
  goToPrev: {
    position: 'absolute',
    top: '50%',
    left: 0,
    zIndex: 100,
    marginTop: -15,
    padding: 10
  },
  buttonPrevIcon: {
    width: 25,
    height: 25,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'black',
    transform: [
      {
        rotate: '-45deg'
      }
    ]
  },
  buttonNextIcon: {
    width: 25,
    height: 25,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: 'black',
    transform: [
      {
        rotate: '45deg'
      }
    ]
  }
});

interface GotoOptions {
  animated?: boolean;
}

// tslint:disable-next-line: cyclomatic-complexity
export const MultiCarousel = <ItemT, >(props: MultiCarouselProps<ItemT>) => {
  const {
    data,
    renderItem,
    PageIndicatorComponent = DEFAULT_PAGE_INDICATOR_COMPONENT,
    keyExtractor = DEFAULT_KEY_EXTRACTOR,
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
    peekSize = DEFAULT_PEEK_SIZE,
    centerMode,
    dotActiveStyle,
    dotStyle,
    hideScrollbar,
    itemStyle,
    itemsAreEqual,
    nextArrowContainerStyle,
    nextArrowStyle,
    onSlideChange,
    pageIndicatorStyle,
    prevArrowContainerStyle,
    prevArrowStyle,
    showArrow,
    style,
    itemUpdated,
    hidePageIndicator,
    hideOverflow,
    nextArrowOnBlur,
    prevArrowOnBlur,
    renderPageIndicator
  } = props;

  const scrollView = useRef<HTMLDivElement>(null);

  const shouldAnimate = !!itemUpdated || !!itemsAreEqual;
  const [opacity] = useState(() => new Animated.Value(shouldAnimate ? 0 : 1));

  const [animating, setAnimating] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [currentScrollX, setCurrentScrollX] = useState(0);
  const [initialScrollX, setInitialScrollX] = useState(0);
  const [initialScrollXTime, setInitialScrollXTime] = useState(0);

  const [prevData, setPrevData] = useState(data);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const numberOfPages = useMemo(
    () => Math.ceil((data?.length ?? 0) / Math.floor(itemsPerPage)),
    [data, itemsPerPage]
  );

  const itemWidth = useMemo(() => {
    if (peekSize && !Number.isInteger(peekSize * 2)) {
      console.error(
        `${MultiCarousel.name}: (peekSize * 2) must be an integer but got (${peekSize} * 2)`
      );
    }

    return (containerWidth - peekSize * (centerMode ? 2 : 1)) / itemsPerPage;
  }, [containerWidth, peekSize, centerMode, itemsPerPage]);

  const snapToInterval = useMemo(
    () => itemWidth * Math.floor(itemsPerPage),
    [itemWidth, itemsPerPage]
  );

  const pageWidth = useMemo(() => itemWidth * Math.floor(itemsPerPage), [itemWidth, itemsPerPage]);

  useLayoutEffect(() => {
    if (shouldAnimate) {
      Animated.timing(opacity, {
        toValue: 1,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true
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

  useEffect(() => {
    const prevItem = prevData?.[currentIndex];
    const nextItem = data?.[currentIndex];

    if (prevItem !== nextItem) {
      const runAnimation = () => {
        opacity.setValue(0);
        Animated.timing(opacity, {
          toValue: 1,
          useNativeDriver: true
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
        style={[{ width: itemWidth, ...{ scrollSnapAlign: 'start' } }, itemStyle]}
      >
        {renderItem?.(info)}
      </View>
    ),
    [renderItem, itemStyle, itemWidth, keyExtractor]
  );

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width),
    [containerWidth, setContainerWidth]
  );

  const goTo = useCallback(
    async (nextIndex: number, { animated = true }: GotoOptions = {}) => {
      const scrollViewElement = findDOMNode(scrollView?.current);

      if (scrollViewElement instanceof HTMLElement && !animating) {
        setAnimating(true);
        await animatedScrollTo(scrollViewElement, nextIndex * pageWidth, animated ? 200 : 0)
          .then(() => setAnimating(false))
          .catch(e => {
            setAnimating(false);
            console.warn('animatedScrollTo error', e);
          });
      }
    },
    [animating, currentIndex, pageWidth, setAnimating, onSlideChange]
  );

  const goToNext = useCallback(async () => {
    const nextIndex = currentIndex + 1 > numberOfPages - 1 ? numberOfPages - 1 : currentIndex + 1;

    await goTo(nextIndex);
  }, [goTo, currentIndex, numberOfPages]);

  const goToPrev = useCallback(async () => {
    const nextIndex = currentIndex - 1 < 0 ? 0 : currentIndex - 1;

    await goTo(nextIndex);
  }, [goTo, currentIndex]);

  const goToOrigin = useCallback(async () => {
    await goTo(currentIndex);
  }, [goTo, currentIndex]);

  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const index =
        e.currentTarget.scrollLeft + pageWidth + peekSize >= e.currentTarget.scrollWidth
          ? numberOfPages - 1
          : Math.round(Math.round(e.currentTarget.scrollLeft) / snapToInterval);
      const nextIndex = Math.min(Math.max(0, index), numberOfPages - 1);

      if (currentIndex !== nextIndex) {
        onSlideChange?.({
          currentIndex,
          nextIndex
        });
      }

      setCurrentIndex(nextIndex);
    },
    [currentIndex, snapToInterval, numberOfPages, pageWidth, peekSize, setCurrentIndex]
  );

  const handleStart = useCallback((pageX: number) => {
    const scrollViewNode = findDOMNode(scrollView?.current);
    if (scrollViewNode instanceof Element) {
      setCurrentScrollX(scrollViewNode.scrollLeft);
    }
    setInitialScrollX(pageX);
    setInitialScrollXTime(Date.now());
    setMouseDown(true);
  }, [scrollView, setCurrentScrollX, setInitialScrollX, setInitialScrollXTime, setMouseDown]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    handleStart(e.pageX);
  }, [handleStart]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length) {
      handleStart(e.touches[0].pageX);
    }
  }, [handleStart]);

  const handleEnd = useCallback(
    (pageX: number) => {
      const dx = initialScrollX - pageX;
      const vx = dx / (initialScrollXTime - Date.now());

      if (dx > 80 || vx < -0.3) {
        goToNext().then(() => setMouseDown(false)).catch();
      } else if (dx < -80 || vx > 0.3) {
        goToPrev().then(() => setMouseDown(false)).catch();
      } else {
        goToOrigin().then(() => setMouseDown(false)).catch();
      }
    },
    [initialScrollX, initialScrollXTime, goToNext, goToPrev, goToOrigin, setMouseDown]
  );

  const handleMouseUp = useCallback((e: MouseEvent) => {
    handleEnd(e.pageX);
  }, [handleEnd]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length) {
      handleEnd(e.touches[0].pageX);
    } else {
      const pageX =
        initialScrollX + currentScrollX - (scrollView?.current?.scrollLeft || 0);
      handleEnd(pageX);
    }
  }, [handleEnd, initialScrollX, currentScrollX, scrollView]);

  const handleMove = useCallback((pageX: number) => {
    if (!animating && mouseDown && currentScrollX !== undefined) {
      const dx = initialScrollX - pageX;
      const scrollX = currentScrollX + dx;
      scrollView?.current?.scrollTo({
        left: scrollX,
        top: 0
      });
    }
  }, [animating, scrollView, mouseDown, initialScrollX, currentScrollX]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.pageX);
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length) {
        handleMove(e.touches[0].pageX);
      }
    },
    [handleMove]
  );

  if (!data) {
    return null;
  }

  if (data.length <= 1) {
    return (
      <View style={[{ alignItems: 'center' }, style]} onLayout={handleLayout}>
        {renderItemContainer?.({
          item: data[0],
          index: 0,
          separators: {
            highlight: () => undefined,
            unhighlight: () => undefined,
            updateProps: () => undefined
          }
        })}
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, style, { opacity }]} onLayout={handleLayout}>
      <div
        ref={scrollView}
        style={{
          display: 'flex',
          flexBasis: 'auto',
          flexDirection: 'row',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          overflowX: hideOverflow ?? hideScrollbar ?? true ? 'hidden' : 'scroll',
          scrollSnapType: mouseDown ? undefined : 'x mandatory'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
      >
        <View
          style={{
            width: centerMode ? peekSize : 0
          }}
        />
        {data?.map((item, index) =>
          renderItemContainer({
            item,
            index,
            separators: {
              highlight: () => undefined,
              unhighlight: () => undefined,
              updateProps: () => undefined
            }
          })
        )}
      </div>

      {hidePageIndicator ? null : renderPageIndicator ? (
        renderPageIndicator(currentIndex, data.length)
      ) : isValidElement(PageIndicatorComponent) ? (
        PageIndicatorComponent
      ) : (
        <PageIndicatorComponent
          style={pageIndicatorStyle}
          currentIndex={currentIndex}
          itemsCount={numberOfPages}
          dotStyle={dotStyle}
          dotActiveStyle={dotActiveStyle}
        />
      )}

      {currentIndex !== 0 && !!showArrow && (
        <TouchableOpacity
          accessibilityRole='button'
          accessibilityLabel={FSI18n.string(translationKeys.flagship.multiCarousel.prevBtn)}
          style={[styles.goToPrev, prevArrowContainerStyle]}
          onPress={goToPrev}
          onBlur={prevArrowOnBlur}
        >
          <View style={[styles.buttonPrevIcon, prevArrowStyle]} />
        </TouchableOpacity>
      )}

      {currentIndex !== numberOfPages - 1 && !!showArrow && (
        <TouchableOpacity
          accessibilityRole='button'
          accessibilityLabel={FSI18n.string(translationKeys.flagship.multiCarousel.nextBtn)}
          style={[styles.goToNext, nextArrowContainerStyle]}
          onPress={goToNext}
          onBlur={nextArrowOnBlur}
        >
          <View style={[styles.buttonNextIcon, nextArrowStyle]} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};
