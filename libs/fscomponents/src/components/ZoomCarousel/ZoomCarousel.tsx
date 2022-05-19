import React, { Component } from 'react';

import type { ListRenderItem, PanResponderInstance } from 'react-native';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import searchIcon from '../../../assets/images/search.png';
import type { CarouselController } from '../MultiCarousel';
import { MultiCarousel } from '../MultiCarousel';
import { PageIndicator } from '../PageIndicator';

import { ZoomImages } from './ZoomImages';
import type { ImageData, ZoomCarouselProps } from './types';

export interface ZoomCarouselStateType {
  isZooming: boolean;
  isZoomVisible: boolean;
  isOpeningZoom: boolean;
  originalImageWidth: number;
  originalImageHeight: number;
  originalImageX: number;
  originalImageY: number;
  currentIndex: number;
  currentZoomIndex: number;
}

const componentTranslationKeys = translationKeys.flagship.zoomCarousel.actions;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 64 : 68;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const APPLE_EASING = Easing.bezier(0.2833, 0.99, 0.31833, 0.99);
const defaultGapSize = 1;

const S = StyleSheet.create({
  activeImageStyle: {
    zIndex: 100,
  },
  button: {
    backgroundColor: '#eee',
    padding: 15,
  },
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
  goToZoomButtons: {
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    position: 'absolute',
    zIndex: 100,
  },
  pageIndicatorZoom: {
    bottom: 20,
    position: 'absolute',
    width: '100%',
    zIndex: 100,
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
  zoomModal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export class ZoomCarousel extends Component<ZoomCarouselProps, ZoomCarouselStateType> {
  public static defaultProps: ZoomCarouselProps = {
    images: [],
    peekSize: 0,
    // for unknown reason(related to useNativeDriver), zoomed image doesn't show if it 0
    gapSize: 1,
  };

  constructor(props: ZoomCarouselProps) {
    super(props);

    if (props.gapSize && props.gapSize !== Math.floor(props.gapSize)) {
      console.error(`ZoomCarousel: gapSize must be an integer but got ${props.gapSize}`);
    }

    const peekSize = props.peekSize || 0;
    const gapSize = this.props.gapSize || defaultGapSize;
    this.zoomContainerWidth =
      SCREEN_WIDTH * props.images.length + gapSize * (props.images.length - 1);
    this.itemWidth = props.centerMode
      ? SCREEN_WIDTH - 2 * peekSize - gapSize
      : SCREEN_WIDTH - peekSize;

    this.imageWidth = this.itemWidth - gapSize;
    this.imageHeight = this.itemWidth - gapSize;
    this.gapSizeScaled = (gapSize * SCREEN_WIDTH) / this.imageWidth;

    this.openScale = new Animated.Value(0);
    this.scrollViewSize = new Animated.Value(this.imageWidth);
    this.scrollViewPosition = new Animated.ValueXY({ x: 0, y: 0 });

    this.initPanResponder();

    this.state = {
      isZooming: false,
      isZoomVisible: false,
      isOpeningZoom: false,
      originalImageWidth: 0,
      originalImageHeight: 0,
      originalImageX: 0,
      originalImageY: 0,
      currentIndex: 0,
      currentZoomIndex: 0,
    };
  }

  private originalImgs: Array<Image | null> = [];
  private lastScrollXStart?: number;
  private lastScrollX?: number;
  private readonly scrollView: unknown;
  private lastPinchDistance?: number;
  private zoomOpening = false;
  private readonly modalRef: unknown;
  private readonly initialScrollX = 0;
  private panResponder?: PanResponderInstance;

  private readonly zoomContainerWidth: number;
  private readonly itemWidth: number;
  private readonly imageWidth: number;
  private readonly imageHeight: number;
  private readonly gapSizeScaled: number;
  private readonly openScale: Animated.Value;
  private readonly scrollViewSize: Animated.Value;
  private readonly scrollViewPosition: Animated.ValueXY;
  private multiCarousel?: CarouselController;

  private readonly initPanResponder = () => {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) =>
        evt.nativeEvent.changedTouches.length > 1,
      onMoveShouldSetPanResponder: (evt, gestureState) => evt.nativeEvent.changedTouches.length > 1,
      onPanResponderTerminationRequest: (evt, gestureState) => false,

      onPanResponderGrant: (evt, gestureState) => {
        this.lastPinchDistance = undefined;
        this.zoomOpening = false;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (evt.nativeEvent.changedTouches.length > 1 && !this.zoomOpening) {
          const distanceX = Math.abs(
            (evt.nativeEvent.changedTouches[0]?.pageX ?? 0) -
              (evt.nativeEvent.changedTouches[1]?.pageX ?? 0)
          );
          const distanceY = Math.abs(
            (evt.nativeEvent.changedTouches[0]?.pageY ?? 0) -
              (evt.nativeEvent.changedTouches[1]?.pageY ?? 0)
          );
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

          if (this.lastPinchDistance === undefined) {
            this.lastPinchDistance = distance;
          } else {
            const distanceDiff = distance - this.lastPinchDistance;
            if (distanceDiff > 5) {
              this.openZoom();
              this.lastPinchDistance = undefined;
              this.zoomOpening = true;
            }
          }
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
  };

  private readonly goToZoomNext = (vx: number) => {
    const { currentZoomIndex } = this.state;
    const nextIndex =
      currentZoomIndex + 1 > this.props.images.length - 1
        ? this.props.images.length - 1
        : currentZoomIndex + 1;

    this.setState({
      currentZoomIndex: nextIndex,
    });

    const nextOffsetX = -nextIndex * SCREEN_WIDTH - nextIndex * this.gapSizeScaled;

    this.multiCarousel?.goToNext({ animated: false });

    Animated.timing(this.scrollViewPosition, {
      toValue: { x: nextOffsetX, y: 0 },
      easing: APPLE_EASING,
      useNativeDriver: false,
    }).start();
  };

  private readonly goToZoomPrev = (vx: number) => {
    const { currentZoomIndex } = this.state;
    const nextIndex = currentZoomIndex - 1 < 0 ? 0 : currentZoomIndex - 1;

    this.setState({
      currentZoomIndex: nextIndex,
    });

    const nextOffsetX = -nextIndex * SCREEN_WIDTH - nextIndex * this.gapSizeScaled;

    this.multiCarousel?.goToPrev({ animated: false });

    Animated.timing(this.scrollViewPosition, {
      toValue: { x: nextOffsetX, y: 0 },
      easing: APPLE_EASING,
      useNativeDriver: false,
    }).start();
  };

  private readonly goToZoomOrigin = () => {
    const { currentZoomIndex } = this.state;
    const nextOffsetX = -currentZoomIndex * SCREEN_WIDTH - currentZoomIndex * this.gapSizeScaled;

    Animated.parallel([
      Animated.timing(this.openScale, {
        toValue: 1,
        easing: APPLE_EASING,
        useNativeDriver: false,
      }),
      Animated.timing(this.scrollViewPosition, {
        toValue: { x: nextOffsetX, y: 0 },
        easing: APPLE_EASING,
        useNativeDriver: false,
      }),
    ]).start();
  };

  private readonly openZoom = () => {
    const image = this.originalImgs[this.state.currentIndex];

    image?.measure(
      (ox: number, oy: number, width: number, height: number, px: number, py: number) => {
        this.setState(
          {
            isZoomVisible: true,
            isZooming: true,
            isOpeningZoom: true,
            originalImageWidth: width,
            originalImageHeight: height,
            originalImageX: px,
            originalImageY: py,
            currentZoomIndex: this.state.currentIndex,
          },
          () => {
            const andjustForContainer =
              (this.zoomContainerWidth -
                (this.zoomContainerWidth * this.imageWidth) / SCREEN_WIDTH) /
              2;

            const peekSize = this.props.peekSize || 0;
            const gapSize = this.props.gapSize || defaultGapSize;
            const offsetWidth = this.props.centerMode
              ? SCREEN_WIDTH - 2 * peekSize - gapSize
              : SCREEN_WIDTH - peekSize;
            this.scrollViewPosition.setValue({
              x: -this.state.currentIndex * offsetWidth - andjustForContainer + px,
              y: (this.imageHeight - SCREEN_HEIGHT) / 2 + HEADER_HEIGHT + py,
            });

            Animated.parallel([
              Animated.spring(this.openScale, {
                toValue: 1,
                useNativeDriver: false,
              }),
              Animated.spring(this.scrollViewSize, {
                toValue: SCREEN_WIDTH,
                useNativeDriver: false,
              }),
              Animated.spring(this.scrollViewPosition, {
                useNativeDriver: false,
                toValue: {
                  x:
                    -this.state.currentIndex * SCREEN_WIDTH -
                    this.state.currentIndex * this.gapSizeScaled,
                  y: 0,
                },
              }),
            ]).start(() => {
              this.setState({
                isOpeningZoom: false,
              });
            });
          }
        );
      }
    );
  };

  private readonly closeZoom = () => {
    const andjustForContainer =
      (this.zoomContainerWidth - (this.zoomContainerWidth * this.imageWidth) / SCREEN_WIDTH) / 2;

    const peekSize = this.props.peekSize || 0;
    const gapSize = this.props.gapSize || defaultGapSize;
    const offsetWidth = this.props.centerMode
      ? SCREEN_WIDTH - 2 * peekSize - gapSize
      : SCREEN_WIDTH - peekSize;

    this.setState(
      {
        isOpeningZoom: true,
      },
      () => {
        Animated.parallel([
          Animated.timing(this.openScale, {
            toValue: 0,
            duration: 250,
            easing: APPLE_EASING,
            useNativeDriver: false,
          }),
          Animated.timing(this.scrollViewSize, {
            toValue: this.imageWidth,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(this.scrollViewPosition, {
            duration: 250,
            useNativeDriver: false,
            toValue: {
              x:
                -this.state.currentIndex * offsetWidth -
                andjustForContainer +
                this.state.originalImageX,
              y: (this.imageHeight - SCREEN_HEIGHT) / 2 + HEADER_HEIGHT + this.state.originalImageY,
            },
          }),
        ]).start(() => {
          // workaround for blinking by using nativeDriver
          // more: https://github.com/facebook/react-native/issues/10174
          this.setState(
            {
              isZoomVisible: false,
              isOpeningZoom: false,
            },
            () => {
              this.setState({
                isZooming: false,
              });
            }
          );
        });
      }
    );
  };

  private readonly handleItemMoveOutY = (offsetY: number) => {
    const itemSnapX =
      this.state.currentZoomIndex * SCREEN_WIDTH + this.state.currentZoomIndex * this.gapSizeScaled;

    const halfScreenHeight = SCREEN_HEIGHT / 2;

    this.scrollViewPosition.setValue({
      x: -itemSnapX,
      y: offsetY,
    });
    this.openScale.setValue((halfScreenHeight - Math.abs(offsetY)) / halfScreenHeight);
  };

  private readonly handleItemMoveOutX = (offsetX: number) => {
    const itemSnapX =
      this.state.currentZoomIndex * SCREEN_WIDTH + this.state.currentZoomIndex * this.gapSizeScaled;

    const allItemSnapX =
      (this.props.images.length - 1) * SCREEN_WIDTH +
      (this.props.images.length - 1) * this.gapSizeScaled;

    let scrollViewOffsetX = offsetX - itemSnapX;

    scrollViewOffsetX = scrollViewOffsetX > 0 ? scrollViewOffsetX / 3 : scrollViewOffsetX;

    scrollViewOffsetX =
      scrollViewOffsetX < -allItemSnapX
        ? -allItemSnapX + (scrollViewOffsetX + itemSnapX) / 3
        : scrollViewOffsetX;

    this.scrollViewPosition.setValue({
      x: scrollViewOffsetX,
      y: 0,
    });

    if (this.lastScrollXStart === null) {
      this.lastScrollXStart = offsetX;
    }
    this.lastScrollX = offsetX;
  };

  private readonly handleZoomRelease = (distance: number) => {
    if (distance < -50) {
      this.closeZoom();
    }
  };

  private readonly handleMoveRelease = (evt: unknown, gestureState: any, justMoveX: boolean) => {
    if (justMoveX) {
      const offsetXDiff = (this.lastScrollX || 0) - (this.lastScrollXStart || 0);

      if (offsetXDiff > 80 || gestureState.vx > 0.5) {
        this.goToZoomPrev(gestureState.vx);
      } else if (offsetXDiff < -80 || gestureState.vx < -0.5) {
        this.goToZoomNext(gestureState.vx);
      } else {
        this.goToZoomOrigin();
      }
      this.lastScrollXStart = undefined;
      this.lastScrollX = undefined;
    } else if (Math.abs(gestureState.dy) > 100 || gestureState.vy > 0.5) {
      this.closeZoom();
    } else {
      this.goToZoomOrigin();
    }
  };

  private readonly renderModal = () => {
    const opacityStyle = {
      opacity: this.openScale,
    };

    const sizeStyle = {
      transform: [
        { translateY: this.scrollViewPosition.y },
        { translateX: this.scrollViewPosition.x },
        {
          scale: this.scrollViewSize.interpolate({
            inputRange: [this.imageWidth, SCREEN_WIDTH],
            outputRange: [this.imageWidth / SCREEN_WIDTH, 1],
          }),
        },
      ],
    };

    if (this.props.renderModalContent) {
      return (
        <Modal onRequestClose={this.closeZoom} transparent visible={this.state.isZooming}>
          {this.props.renderModalContent(this.closeZoom)}
        </Modal>
      );
    }
    return (
      <Modal onRequestClose={this.closeZoom} transparent visible={this.state.isZooming}>
        <ZoomImages
          closeButtonStyle={this.props.closeButtonStyle}
          closeZoom={this.closeZoom}
          currentZoomIndex={this.state.currentZoomIndex}
          gapSizeScaled={this.gapSizeScaled}
          goToZoomNext={this.goToZoomNext}
          goToZoomPrev={this.goToZoomPrev}
          handleItemMoveOutX={this.handleItemMoveOutX}
          handleItemMoveOutY={this.handleItemMoveOutY}
          handleMoveRelease={this.handleMoveRelease}
          handleZoomRelease={this.handleZoomRelease}
          images={this.props.images}
          isOpeningZoom={this.state.isOpeningZoom}
          opacityStyle={opacityStyle}
          renderCloseButton={this.props.renderCloseButton}
          showArrow={this.props.showArrow}
          sizeStyle={sizeStyle}
          style={{ opacity: this.state.isZoomVisible ? 1 : 0 }}
          zoomContainerWidth={this.zoomContainerWidth}
        />

        <Animated.View
          style={[S.pageIndicatorZoom, opacityStyle, this.props.pageIndicatorZoomStyle]}
        >
          {this.props.renderPageIndicator ? (
            this.props.renderPageIndicator(this.state.currentIndex, this.props.images.length)
          ) : (
            <PageIndicator
              currentIndex={this.state.currentIndex}
              dotActiveStyle={this.props.dotActiveStyle}
              dotStyle={this.props.dotStyle}
              itemsCount={this.props.images.length}
            />
          )}
        </Animated.View>
      </Modal>
    );
  };

  private readonly handleThumbPress = (i: number) => {
    this.multiCarousel?.goTo(i);
  };

  private readonly makeHandleThumbPress = (i: number) => () => {
    this.multiCarousel?.goTo(i);
  };

  private readonly itemUpdated = (
    oldItem: ImageData | null | undefined,
    newItem: ImageData | null | undefined,
    index: number,
    changed: () => void
  ) => {
    if (newItem === undefined || newItem === null || oldItem === undefined || oldItem === null) {
      return;
    }

    if (
      typeof newItem.src === 'object' &&
      'uri' in newItem.src &&
      typeof oldItem.src === 'object' &&
      'uri' in oldItem.src &&
      newItem.src.uri !== oldItem.src.uri
    ) {
      changed();
    }

    if (newItem.src !== oldItem.src) {
      changed();
    }
  };

  private readonly renderImage: ListRenderItem<ImageData> = ({ index, item }) => {
    const gapSize = this.props.gapSize || defaultGapSize;

    if (this.props.renderImage) {
      return this.props.renderImage(
        item,
        index,
        this.originalImgs,
        this.imageWidth,
        this.imageHeight,
        this.openZoom
      );
    }

    return (
      <View
        key={index}
        style={{
          paddingRight: this.props.centerMode ? gapSize / 2 : gapSize,
          paddingLeft: this.props.centerMode ? gapSize / 2 : 0,
        }}
      >
        <Image
          ref={(img) => {
            const image = img;

            this.originalImgs[index] = image;
          }}
          resizeMode="contain"
          source={item.src}
          style={[
            {
              width: this.imageWidth,
              height: this.imageHeight,
            },
            this.props.fillContainer ? S.fullHeight : null,
          ]}
        />
      </View>
    );
  };

  private readonly handleSlideChange = ({ currentIndex, nextIndex }: any) => {
    this.setState({
      currentIndex: nextIndex,
    });
  };

  private readonly handleCarouselController = (controller: CarouselController) => {
    this.multiCarousel = controller;
  };

  private readonly renderCarousel = () => {
    const peekSize = this.props.peekSize || 0;
    const gapSize = this.props.gapSize || defaultGapSize;
    return (
      <MultiCarousel
        carouselController={this.handleCarouselController}
        centerMode={this.props.centerMode}
        contentContainerStyle={this.props.contentContainerStyle}
        data={this.props.images}
        dotActiveStyle={this.props.dotActiveStyle}
        dotStyle={this.props.dotStyle}
        itemUpdated={this.itemUpdated}
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
    );
  };

  public render(): JSX.Element {
    return (
      <View style={this.props.fillContainer ? S.fullHeight : null}>
        <View style={this.props.fillContainer ? S.fullHeight : null}>
          <View
            style={this.props.fillContainer ? S.fullHeight : null}
            {...this.panResponder?.panHandlers}
          >
            {this.renderCarousel()}
          </View>

          {this.renderModal()}
          {!this.props.hideZoomButton && (
            <View style={[S.zoomButtonContainer, this.props.zoomButtonStyle]}>
              {this.props.renderZoomButton ? (
                this.props.renderZoomButton(this.openZoom)
              ) : (
                <TouchableOpacity
                  accessibilityLabel={FSI18n.string(componentTranslationKeys.fullscreen.actionBtn)}
                  accessibilityRole="button"
                  onPress={this.openZoom}
                  style={S.zoomButton}
                >
                  <Image source={searchIcon} style={S.searchIcon} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {this.props.showThumbnails &&
          (this.props.renderThumbnails ? (
            this.props.renderThumbnails(this.state.currentIndex, this.handleThumbPress)
          ) : (
            <ScrollView
              contentContainerStyle={[S.thumbnailContainer, this.props.thumbnailContainerStyle]}
              horizontal
            >
              {this.props.images.map((img, i) => (
                <TouchableOpacity
                  accessibilityLabel={FSI18n.string(componentTranslationKeys.focus.actionBtn)}
                  accessibilityRole="button"
                  key={i}
                  onPress={this.makeHandleThumbPress(i)}
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
          ))}
      </View>
    );
  }
}
