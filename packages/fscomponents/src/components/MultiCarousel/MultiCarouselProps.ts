import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// TODO: Rename this interface
export interface SlideChangeEvent {
  currentIndex: number;
  nextIndex: number;
}

export interface SerializableMultiCarouselProps {
  centerMode?: boolean;
  peekSize?: number;
  itemsPerPage?: number;
  hidePageIndicator?: boolean;
  showArrow?: boolean;
  hideZoomButton?: boolean;
  contentContainerStyle?: ViewStyle;
}


// TODO: Clean up these props
export interface MultiCarouselProps<ItemT> extends Omit<
  SerializableMultiCarouselProps,
  'contentContainerStyle'
  > {
  brandStyle?: any;
  buttonProps?: any;
  dotActiveStyle?: any;
  dotStyle?: any;
  items: ItemT[];
  itemStyle?: any;
  itemUpdated?: (oldItem: ItemT, newItem: ItemT, index: number, changed: () => void) => void;
  onSlideChange?: (data: SlideChangeEvent) => void;
  nextArrowContainerStyle?: any;
  nextArrowStyle?: any;
  nextArrowOnBlur?: () => void;
  pageIndicatorStyle?: any;
  prevArrowContainerStyle?: any;
  prevArrowStyle?: any;
  prevArrowOnBlur?: () => void;
  renderItem: (data: any, i: number) => ReactNode;
  renderPageIndicator?: (currentIndex: number, itemsCount: number) => ReactNode;
  style?: any;
  zoomButtonStyle?: any;
  keyExtractor?: (item: ItemT, index: number) => string;
  contentContainerStyle?: StyleProp<ViewStyle>;
}
