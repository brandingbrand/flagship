import { ComponentType, ReactElement, ReactNode } from 'react';
import { FlatListProps, StyleProp, ViewStyle } from 'react-native';
import { PageIndicatorProps } from '../PageIndicator';
import { CarouselController } from './CarouselController';

export interface SlideChangeEvent {
  currentIndex: number;
  nextIndex: number;
}

export interface MultiCarouselProps<ItemT>
  extends Pick<
    FlatListProps<ItemT>,
    | 'accessible'
    | 'accessibilityHint'
    | 'accessibilityLabel'
    | 'accessibilityRole'
    | 'style'
    | 'renderItem'
    | 'data'
    | 'keyExtractor'
  > {
  /**
   * Similar to `ref`, used to get ahold of the control functions for the
   * carousel
   */
  carouselController?: (controller: CarouselController) => void;

  /**
   * The number of items to show per page, defaults to `auto`
   */
  itemsPerPage?: 'auto' | number;

  /**
   * The width to use for each item when `itemsPerPage`
   * is set to auto, defaults to `175`
   */
  itemWidth?: number;

  /**
   * How many pixels of the item from the next page to show when
   * `itemWidth` is set to auto
   */
  peekSize?: number;

  /**
   *
   */
  centerMode?: boolean;

  /**
   * The style of the view directly wrapping each rendered item
   */
  itemStyle?: StyleProp<ViewStyle>;

  /**
   * The style wrapping the entire list
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * @deprecated to be removed in fs12, use `hideScrollbar`
   * @platform web
   */
  hideOverflow?: boolean;

  /**
   * Wether the scrollbar should be hidden, defaults to `true`
   * @platform web
   */
  hideScrollbar?: boolean;

  /**
   * The dot style to use for the `PageIndicatorComponent`
   */
  dotStyle?: StyleProp<ViewStyle>;

  /**
   * The active dot style to use for the `PageIndicatorComponent`
   */
  dotActiveStyle?: StyleProp<ViewStyle>;

  /**
   * Wether the `PageIndicatorComponent` should be hidden
   * @deprecated to be removed in fs12, use `PageIndicatorComponent`
   */
  hidePageIndicator?: boolean;

  /**
   * The style to use for the `PageIndicatorComponent`
   */
  pageIndicatorStyle?: StyleProp<ViewStyle>;

  /**
   * @deprecated to be removed in fs12, use PageIndicatorComponent
   */
  renderPageIndicator?: (currentIndex: number, itemsCount: number) => ReactNode;

  /**
   * The page indicator component to show under the carousel
   * Defaults to `PageIndicator` from `@brandingbrand/fscomponents`
   */
  PageIndicatorComponent?: ComponentType<PageIndicatorProps> | ReactElement;

  /**
   * Wether the next and previous arrows should show
   */
  showArrow?: boolean;

  /**
   * The style to use for the next arrow
   */
  nextArrowStyle?: StyleProp<ViewStyle>;

  /**
   * The style to use for the container of the next arrow
   */
  nextArrowContainerStyle?: StyleProp<ViewStyle>;

  /**
   * A function to call when the next arrow loses focus
   */
  nextArrowOnBlur?: () => void;

  /**
   * The style to use for the previous arrow
   */
  prevArrowStyle?: StyleProp<ViewStyle>;

  /**
   * The style to use for the container of the previous arrow
   */
  prevArrowContainerStyle?: StyleProp<ViewStyle>;

  /**
   * A function to call when the next arrow loses focus
   */
  prevArrowOnBlur?: () => void;

  /**
   * @deprecated to be removed in fs12, use `itemAreEqual`
   */
  itemUpdated?: (
    prevItem: ItemT | null | undefined,
    nextItem: ItemT | null | undefined,
    index: number,
    changed: () => void
  ) => void;

  /**
   * A callback called to determine if two items are equal.
   * If provided then a fade animation will be applied whenever
   * the `data` prop changes.
   */
  itemsAreEqual?: (
    prevItem: ItemT | null | undefined,
    nextItem: ItemT | null | undefined
  ) => boolean;

  /**
   * A callback fired whenever the slide changes
   */
  onSlideChange?: (data: SlideChangeEvent) => void;
  /**
   * Boolean to determine rather the carousel should autoplay
   */
  autoplay?: boolean;
  /**
   * Number in miliseconds that defines the delay between transitions
   */
  autoplayTimeoutDuration?: number;
}

