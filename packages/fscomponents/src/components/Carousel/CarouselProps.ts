import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Swiper from 'react-native-swiper';

// TODO: Unify these web/native options and clean up these types ...a lot
export interface CarouselProps {
  currentPageIndicatorColor?: string;
  height?: number;
  loop?: boolean;
  nativeOptions?: Swiper;
  pageIndicatorColor?: string;
  paginationMarginBottom?: number;
  showsPagination?: boolean;
  style?: StyleProp<ViewStyle>;
  webOptions?: any;
  webPaddingBottom?: number;
  showsButtons?: boolean;
  nextButton?: ReactNode;
  prevButton?: ReactNode;
}
