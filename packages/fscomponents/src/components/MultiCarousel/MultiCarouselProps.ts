import {ReactNode} from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// TODO: Rename this interface
export interface SlideChangeEvent {
  currentIndex: number;
  nextIndex: number;
}

export interface OptionsType {
  animated: boolean;
}

export interface MultiCarouselProps<ItemT> {
  width: number;
  centerMode?: boolean;
  dotActiveStyle?: StyleProp<ViewStyle>;
  dotStyle?: StyleProp<ViewStyle>;
  items: ItemT[];
  itemsPerPage?: number;
  itemStyle?: ViewStyle;
  itemUpdated?: (oldItem: ItemT, newItem: ItemT, index: number, changed: () => void) => void;
  onSlideChange?: (data: SlideChangeEvent) => void;
  nextArrowContainerStyle?: StyleProp<ViewStyle>;
  nextArrowStyle?: StyleProp<ViewStyle>;
  nextArrowOnBlur?: () => void;
  pageIndicatorStyle?: StyleProp<ViewStyle>;
  peekSize?: number;
  prevArrowContainerStyle?: StyleProp<ViewStyle>;
  prevArrowStyle?: StyleProp<ViewStyle>;
  prevArrowOnBlur?: () => void;
  renderItem: <T>(data: T, i: number) => ReactNode;
  renderPageIndicator?: (currentIndex: number, itemsCount: number) => ReactNode;
  hidePageIndicator?: boolean;
  showArrow?: boolean;
  style?: StyleProp<ViewStyle>;
  keyExtractor?: (item: ItemT, index: number) => string;
  contentContainerStyle?: StyleProp<ViewStyle>;
}
