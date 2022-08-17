/**
 * what's special about this carousel
 * - two states: normal carousel, zoomed carousel
 * - pinch zoom on normal carouse: trigger zoomed carousel
 * - pinch zoom on zoomed carousel and release: restore back too zoomed carousel
 */

import React, { Component } from 'react';

import type { ListRenderItem } from 'react-native';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import searchIcon from '../../../assets/images/search.png';
import { Modal } from '../Modal';
import type { CarouselController } from '../MultiCarousel';
import { MultiCarousel } from '../MultiCarousel';

import { PhotoSwipe } from './PhotoSwipe.web';
import type { ImageData, ZoomCarouselProps } from './types';

const componentTranslationKeys = translationKeys.flagship.zoomCarousel.actions;
const zoomTranslationKey = FSI18n.string(componentTranslationKeys.fullscreen.actionBtn);

let ZOOM_CAROUSEL_ID = 0;

type ImageGetSize = (
  uri: string,
  success: (width: number, height: number) => void,
  failure: (error: unknown) => void
) => unknown;

const getSize: ImageGetSize = Image.getSize.bind(Image);

export interface ImageSize {
  width: number;
  height: number;
}

export interface ZoomCarouselStateType {
  isZooming: boolean;
  currentIndex: number;
  imageSizes: ImageSize[];

  imageWidth: number;
  imageHeight: number;
  screenWidth: number;
}

const S = StyleSheet.create({
  buttonNextIcon: {
    borderColor: 'black',
    borderRightWidth: 2,
    borderTopWidth: 2,
    height: 25,
    transform: [
      {
        rotate: '45deg',
      },
    ],
    width: 25,
  },
  buttonPrevIcon: {
    borderColor: 'black',
    borderLeftWidth: 2,
    borderTopWidth: 2,
    height: 25,
    transform: [
      {
        rotate: '-45deg',
      },
    ],
    width: 25,
  },
  carouselContainer: {
    flex: 1,
    flexBasis: 'auto',
  },
  fullHeight: {
    height: '100%',
  },
  goToNext: {
    marginTop: -15,
    padding: 10,
    position: 'absolute',
    right: 0,
    top: '50%',
    zIndex: 100,
  },
  goToPrev: {
    left: 0,
    marginTop: -15,
    padding: 10,
    position: 'absolute',
    top: '50%',
    zIndex: 100,
  },
  imageCounter: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  searchIcon: {
    height: 25,
    width: 25,
  },
  thumbnail: {
    height: 50,
    marginRight: 10,
    width: 50,
  },
  thumbnailContainer: {
    margin: 10,
  },
  thumbnailImg: {
    height: '100%',
    width: '100%',
  },
  thumbnailSelected: {
    borderColor: 'red',
    borderWidth: 3,
  },
  zoomButton: {
    opacity: 0.5,
  },
  zoomButtonContainer: {
    bottom: 30,
    position: 'absolute',
    right: 50,
    zIndex: 101,
  },
});

export class ZoomCarousel extends Component<ZoomCarouselProps, ZoomCarouselStateType> {
  public static defaultProps: ZoomCarouselProps = {
    images: [],
    peekSize: 0,
    gapSize: 0,
  };

  constructor(props: ZoomCarouselProps) {
    super(props);
    const screenWidth = Dimensions.get('window').width;

    const peekSize = props.peekSize || 0;
    const gapSize = props.gapSize || 0;

    this.id = ZOOM_CAROUSEL_ID++;
    const itemWidth = props.centerMode
      ? screenWidth - 2 * peekSize - gapSize
      : screenWidth - peekSize;
    const imageWidth = itemWidth - gapSize;
    const imageHeight = itemWidth - gapSize;

    this.state = {
      isZooming: false,
      currentIndex: 0,
      imageSizes: [],

      imageWidth,
      imageHeight,
      screenWidth,
    };

    // get the image ratio
    for (const [i, img] of props.images.entries()) {
      const uri = typeof img.src === 'number' ? (img.src as unknown as string) : img.src.uri;

      if (uri) {
        getSize(
          uri,
          (width, height) => {
            const { imageSizes } = this.state;
            imageSizes[i] = { width, height };
            this.setState({
              imageSizes,
            });
          },
          (err) => {
            console.warn('image getSize failed', err);
          }
        );
      }
    }
  }

  private multiCarousel?: CarouselController;
  private readonly id: number;

  private readonly goToNext = () => {
    this.multiCarousel?.goToNext();
  };

  private readonly goToPrev = () => {
    this.multiCarousel?.goToPrev();
  };

  private readonly openZoom = () => {
    this.setState({
      isZooming: true,
    });
  };

  private readonly closeZoom = () => {
    this.setState({
      isZooming: false,
    });
  };

  private readonly handleSlideChange = ({ currentIndex, nextIndex }: any) => {
    this.setState({
      currentIndex: nextIndex,
    });
  };

  private readonly handleZoomCarouselChange = (pswp: any) => {
    const currentIndex = pswp.getCurrentIndex();
    this.setState({ currentIndex });
    this.multiCarousel?.goTo(currentIndex);
  };

  private readonly handleLayoutChange = (e: unknown) => {
    const { centerMode, gapSize = 0, peekSize = 0 } = this.props;
    const screenWidth = Dimensions.get('window').width;

    const itemWidth = centerMode ? screenWidth - 2 * peekSize - gapSize : screenWidth - peekSize;
    const imageWidth = itemWidth - gapSize;
    const imageHeight = itemWidth - gapSize;

    this.setState({
      imageWidth,
      imageHeight,
      screenWidth,
    });
  };

  private readonly goTo = (i: number) => {
    this.multiCarousel?.goTo(i);
  };

  private readonly handleThumbPress = (i: number) => () => {
    this.goTo(i);
  };

  private readonly extractMultiCarousel = (controller: CarouselController) => {
    this.multiCarousel = controller;
  };

  private readonly renderImage: ListRenderItem<ImageData> = ({ index, item }) => (
    <View style={this.props.fillContainer ? S.fullHeight : null}>
      {(this.props.renderImageWeb && this.props.renderImageWeb(item, index)) || (
        <Image
          resizeMode="contain"
          source={item.src}
          style={{
            width: this.state.imageWidth,
            height: this.state.imageHeight,
          }}
        />
      )}
    </View>
  );

  private readonly renderImageCounter = () => {
    const total: number = (this.props.images && this.props.images.length) || 0;
    const currentIndex = this.state.currentIndex + 1;

    return (
      <View style={this.props.imageCounterStyle || S.imageCounter}>
        <Text>{`${currentIndex}/${total}`}</Text>
      </View>
    );
  };

  private readonly renderPhotoSwipe = () => (
    <PhotoSwipe
      afterChange={this.handleZoomCarouselChange}
      isOpen={this.state.isZooming}
      items={this.props.images
        .map((img) => img.zoomSrc || img.src)
        .map((img, i) => ({
          src: typeof img === 'object' ? img.uri ?? img : img,
          w: this.state.screenWidth,
          h: this.state.imageSizes[i]
            ? (this.state.screenWidth * (this.state.imageSizes[i]?.height ?? 0)) /
              (this.state.imageSizes[i]?.width ?? 0)
            : this.state.imageHeight,
        }))}
      onClose={this.closeZoom}
      options={{
        loop: false,
        fullscreenEl: false,
        shareEl: false,
        captionEl: false,
        history: false,
        closeOnScroll: false,
        index: this.state.currentIndex,
      }}
    />
  );

  private readonly renderCustomModal = () =>
    this.props.renderModalContent ? (
      <Modal transparent visible={this.state.isZooming}>
        {this.props.renderModalContent(this.closeZoom)}
      </Modal>
    ) : (
      this.renderPhotoSwipe()
    );

  private readonly renderThumbnails = () => (
    <ScrollView
      contentContainerStyle={[S.thumbnailContainer, this.props.thumbnailContainerStyle]}
      horizontal
    >
      {this.props.images.map((img, i) => (
        <TouchableOpacity
          accessibilityLabel={FSI18n.string(componentTranslationKeys.focus.actionBtn)}
          accessibilityRole="button"
          key={i}
          onPress={this.handleThumbPress(i)}
          style={[
            S.thumbnail,
            this.props.thumbnailStyle,
            this.state.currentIndex === i && S.thumbnailSelected,
          ]}
        >
          <Image resizeMode="cover" source={img.src} style={S.thumbnailImg} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  public render(): JSX.Element {
    const { gapSize = 0, peekSize = 0 } = this.props;
    return (
      <View
        onLayout={this.handleLayoutChange}
        style={this.props.contentContainerStyle || S.carouselContainer}
      >
        <View style={this.props.imageContainerStyle || S.carouselContainer}>
          <div
            id={`zoom-carousel-${this.id}`}
            style={this.props.fillContainer ? { height: '100%' } : undefined}
          >
            <MultiCarousel
              carouselController={this.extractMultiCarousel}
              centerMode={this.props.centerMode}
              data={this.props.images}
              dotActiveStyle={this.props.dotActiveStyle}
              dotStyle={this.props.dotStyle}
              hideOverflow={this.props.hideOverflow}
              hidePageIndicator={this.props.hidePageIndicator}
              itemsPerPage={1}
              nextArrowOnBlur={this.props.nextArrowOnBlur}
              onSlideChange={this.handleSlideChange}
              pageIndicatorStyle={this.props.pageIndicatorStyle}
              peekSize={peekSize + (this.props.centerMode ? gapSize / 2 : 0)}
              renderItem={this.renderImage}
              renderPageIndicator={this.props.renderPageIndicator}
              showArrow={this.props.showArrow}
              style={this.props.fillContainer ? S.fullHeight : null}
            />

            {!this.props.hideZoomButton && (
              <View style={[S.zoomButtonContainer, this.props.zoomButtonStyle]}>
                {this.props.renderZoomButton ? (
                  this.props.renderZoomButton(this.openZoom)
                ) : (
                  <TouchableOpacity
                    accessibilityLabel={zoomTranslationKey}
                    accessibilityRole="button"
                    onPress={this.openZoom}
                    style={S.zoomButton}
                  >
                    <Image source={searchIcon} style={S.searchIcon} />
                  </TouchableOpacity>
                )}
              </View>
            )}
            {this.renderCustomModal()}
          </div>
        </View>

        {this.props.showThumbnails
          ? this.props.renderThumbnails
            ? this.props.renderThumbnails(this.state.currentIndex, this.goTo)
            : this.renderThumbnails()
          : null}
        {this.props.showImageCounter
          ? this.props.renderImageCounter
            ? this.props.renderImageCounter(this.state.currentIndex)
            : this.renderImageCounter()
          : null}
      </View>
    );
  }
}
