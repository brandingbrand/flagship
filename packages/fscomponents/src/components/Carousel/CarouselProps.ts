import { StyleProp, ViewStyle } from 'react-native';

// TODO: Unify these web/native options and clean up these types ...a lot
export interface CarouselProps {
  currentPageIndicatorColor?: string;
  height?: number;
  loop?: boolean;
  nativeOptions?: any;
  pageIndicatorColor?: string;
  paginationMarginBottom?: number;
  showsPagination?: boolean;
  style?: StyleProp<ViewStyle>;
  webOptions?: any;
  webPaddingBottom?: number;
}
