import { ImageProperties, ImageURISource, StyleProp, ViewStyle } from 'react-native';

export interface ImageData {
  src: ImageURISource;
  zoomSrc?: ImageURISource;
}

export interface ZoomCarouselProps {
  images: ImageData[];
  gapSize?: number;
  centerMode?: boolean;
  hideZoomButton?: boolean;
  fillContainer?: boolean;
  peekSize?: number;
  showArrow?: boolean;
  pageIndicatorZoomStyle?: any;
  closeButtonStyle?: any;
  dotStyle?: any;
  dotActiveStyle?: any;
  pageIndicatorStyle?: any;
  zoomButtonStyle?: any;
  renderImage?: (
    item: ImageData,
    index: number,
    originalImgs: React.Component<ImageProperties, React.ComponentState>[],
    imageWidth: number,
    imageHeight: number,
    openZoom: () => void
  ) => React.ReactNode;
  renderImageWeb?: (data: any, i: number) => React.ReactNode;
  renderCloseButton?: (closeZoom: () => void) => React.ReactNode;
  renderModalContent?: (closeModal: () => void) => React.ReactNode;
  renderPageIndicator?: (
    currentIndex: number,
    itemsCount: number
  ) => React.ReactNode;
  renderZoomButton?: (openZoom: () => void) => React.ReactNode;
  renderThumbnails?: (
    currentIndex: number,
    goTo: (index: number, options: any) => void
  ) => React.ReactNode;
  nextArrowOnBlur?: () => void;
  showThumbnails?: boolean;
  thumbnailStyle?: any;
  thumbnailContainerStyle?: any;
  contentContainerStyle?: StyleProp<ViewStyle>;
}
