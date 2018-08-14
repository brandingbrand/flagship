import { ReactNode } from 'react';

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
  items: ItemT[];
  itemsPerPage?: number;
  itemStyle?: any;
  onSlideChange?: (data: SlideChangeEvent) => void;
  pageIndicatorStyle?: any;
  peekSize?: number;
  renderItem: (data: any, i: number) => ReactNode;
  renderPageIndicator?: (currentIndex: number, itemsCount: number) => ReactNode;
  showArrow?: boolean;
  style?: any;
  zoomButtonStyle?: any;
  keyExtractor?: (item: ItemT, index: number) => string;
}
