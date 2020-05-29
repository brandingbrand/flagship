import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// TODO: Unify these web/native options and clean up these types ...a lot
export interface SerializableCarouselProps {
  currentPageIndicatorColor?: string;
  height?: number;
  loop?: boolean;
  pageIndicatorColor?: string;
  paginationMarginBottom?: number;
  showsPagination?: boolean;
  style?: ViewStyle;
  webPaddingBottom?: number;
  showsButtons?: boolean;
}

export interface CarouselProps extends Omit<
  SerializableCarouselProps,
  'style'
> {
  style?: StyleProp<ViewStyle>;
  nativeOptions?: any;
  webOptions?: any;
  nextButton?: ReactNode;
  prevButton?: ReactNode;
}
