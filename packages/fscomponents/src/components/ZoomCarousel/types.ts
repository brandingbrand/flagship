import { ImageProperties, ImageURISource, StyleProp, ViewStyle } from 'react-native';

export interface ImageData {
  src: ImageURISource;
  zoomSrc?: ImageURISource;
}

export interface SerializableZoomCarouselProps {
  gapSize?: number;
  centerMode?: boolean;
  hideZoomButton?: boolean;
  fillContainer?: boolean;
  peekSize?: number;
  showArrow?: boolean;
  showThumbnails?: boolean;
  images: ImageData[];
  contentContainerStyle?: ViewStyle;
  imageContainerStyle?: ViewStyle;
  imageCounterStyle?: ViewStyle;
  /**
   * Boolean to turn on and off the page indicator (dots)
   *
   * @example true
   */
  hidePageIndicator?: boolean;
  /**
   * Dicates whether the default image counter displays
   *
   * @example true
   */
  showImageCounter?: boolean;
}

export interface ZoomCarouselProps extends Omit<
  SerializableZoomCarouselProps,
  'contentContainerStyle' |
  'imageContainerStyle' |
  'imageCounterStyle'
  > {
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
  thumbnailStyle?: any;
  thumbnailContainerStyle?: any;

  /**
   * The styling of the container that holds the image carousel and thumbnails
   *
   * @example {{flex: 1}}
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * The styling of the container that holds just the image carousel
   *
   * @example {{minHeight: 400px}}
   */
  imageContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom styling for the imageCounter. Use absolute positioning to set the location
   *
   * @example {{position: 'absolute'}}
   */
  imageCounterStyle?: StyleProp<ViewStyle>;

  /**
   * custom image counter rendering. This function is called last inside the carousel container
   *
   * @example const renderImageCounter = (currentIndex: number) => (<View>1/2</View>)
   */
  renderImageCounter?: (
    currentIndex: number
  ) => React.ReactNode;
}
