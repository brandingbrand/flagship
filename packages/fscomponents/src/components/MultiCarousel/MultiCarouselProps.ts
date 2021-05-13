import { ReactNode } from 'react';
import { ListRenderItemInfo, StyleProp, ViewStyle } from 'react-native';

// TODO: Rename this interface
export interface SlideChangeEvent {
  currentIndex: number;
  nextIndex: number;
}

// TODO: Clean up these props
export interface MultiCarouselProps<ItemT> {
  brandStyle?: any;
  buttonProps?: any;
  centerMode?: boolean;
  dotActiveStyle?: any;
  dotStyle?: any;
  data: ItemT[];
  itemsPerPage?: number;
  itemStyle?: any;
  itemUpdated?: (oldItem: ItemT, newItem: ItemT, index: number, changed: () => void) => void;
  onSlideChange?: (data: SlideChangeEvent) => void;
  nextArrowContainerStyle?: any;
  nextArrowStyle?: any;
  nextArrowOnBlur?: () => void;
  pageIndicatorStyle?: any;
  peekSize?: number;
  prevArrowContainerStyle?: any;
  prevArrowStyle?: any;
  prevArrowOnBlur?: () => void;
  renderItem: (data: ListRenderItemInfo<ItemT>) => ReactNode;
  renderPageIndicator?: (currentIndex: number, itemsCount: number) => ReactNode;
  hidePageIndicator?: boolean;
  showArrow?: boolean;
  style?: any;
  zoomButtonStyle?: any;
  keyExtractor?: (item: ItemT, index: number) => string;
  hideZoomButton?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}
