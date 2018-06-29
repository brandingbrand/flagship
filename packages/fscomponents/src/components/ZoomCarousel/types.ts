import { ImageProperties, ImageURISource } from 'react-native';

export interface ImageData {
  src: ImageURISource;
  zoomSrc?: ImageURISource;
}

export interface ZoomCarouselProps {
  images: ImageData[];
  gapSize?: number;
  centerMode?: boolean;
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
  renderCloseButton?: (closeZoom: () => void) => React.ReactNode;
  renderPageIndicator?: (
    currentIndex: number,
    itemsCount: number
  ) => React.ReactNode;
  renderZoomButton?: (openZoom: () => void) => React.ReactNode;
  renderThumbnails?: (
    currentIndex: number,
    goTo: (index: number, options: any) => void
  ) => React.ReactNode;
  showThumbnails?: boolean;
  thumbnailStyle?: any;
  thumbnailContainerStyle?: any;
}
