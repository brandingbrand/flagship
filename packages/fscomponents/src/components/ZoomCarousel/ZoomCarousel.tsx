import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageProperties,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { ImageData, ZoomCarouselProps } from './types';
import { PageIndicator } from '../PageIndicator';
import { MultiCarousel } from '../MultiCarousel';
import { ZoomImages } from './ZoomImages';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

export interface ZoomCarouselStateType {
  isZooming: boolean;
  isZoomVisible: boolean;
  isOpeningZoom: boolean;
  orignalImageWidth: number;
  orignalImageHeight: number;
  orignalImageX: number;
  orignalImageY: number;
  currentIndex: number;
  currentZoomIndex: number;
}

const componentTranslationKeys = translationKeys.flagship.zoomCarousel.actions;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 64 : 68;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const searchIcon = require('../../../assets/images/search.png');

const APPLE_EASING = Easing.bezier(0.2833, 0.99, 0.31833, 0.99);
const defaultGapSize = 1;

const S = StyleSheet.create({
  zoomModal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    padding: 15,
    backgroundColor: '#eee'
  },
  activeImageStyle: {
    zIndex: 100
  },
  fullHeight: {
    height: '100%'
  },
  goToZoomButtons: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    left: 0,
    zIndex: 100
  },
  goToNext: {
    position: 'absolute',
    top: '50%',
    right: 0,
    zIndex: 100,
    marginTop: -15,
    padding: 10
  },
  goToPrev: {
    position: 'absolute',
    top: '50%',
    left: 0,
    zIndex: 100,
    marginTop: -15,
    padding: 10
  },
  pageIndicatorZoom: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    zIndex: 100
  },
  searchIcon: {
    width: 25,
    height: 25
  },
  zoomButtonContainer: {
    position: 'absolute',
    right: 50,
    bottom: 30,
    zIndex: 101
  },
  zoomButton: {
    opacity: 0.5
  },
  thumbnailImg: {
    width: '100%',
    height: '100%'
  },
  thumbnail: {
    marginRight: 10,
    width: 50,
    height: 50
  },
  thumbnailContainer: {
    margin: 10
  },
  thumbnailSelected: {
    borderWidth: 3,
    borderColor: 'red'
  },
  buttonPrevIcon: {
    width: 25,
    height: 25,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'black',
    transform: [
      {
        rotate: '-45deg'
      }
    ]
  },
  buttonNextIcon: {
    width: 25,
    height: 25,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: 'black',
    transform: [
      {
        rotate: '45deg'
      }
    ]
  }
});

export class ZoomCarousel extends Component<ZoomCarouselProps, ZoomCarouselStateType> {
  static defaultProps: ZoomCarouselProps = {
    images: [],
    peekSize: 0,
    // for unknown reason(related to useNativeDriver), zoomed image doesn't show if it 0
    gapSize: 1
  };

  originalImgs: React.Component<ImageProperties, React.ComponentState>[] = [];
  lastScrollXStart?: number;
  lastScrollX?: number;
  scrollView: any;
  lastPinchDistance?: number;
  zoomOpenning: boolean = false;
  modalRef: any;
  initialScrollX: number = 0;
  panResponder: any;
  multiCarousel: any;

  zoomContainerWidth: number;
  itemWidth: number;
  imageWidth: number;
  imageHeight: number;
  gapSizeScaled: number;
  openScale: Animated.Value;
  scrollViewSize: Animated.Value;
  scrollViewPosition: Animated.ValueXY;

  constructor(props: ZoomCarouselProps) {
    super(props);

    if (props.gapSize && props.gapSize !== Math.floor(props.gapSize)) {
      console.error(
        `ZoomCarousel: gapSize must be an integer but got ${
          props.gapSize
        }`
      );
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
    this.gapSizeScaled = gapSize * SCREEN_WIDTH / this.imageWidth;

    this.openScale = new Animated.Value(0);
    this.scrollViewSize = new Animated.Value(this.imageWidth);
    this.scrollViewPosition = new Animated.ValueXY({ x: 0, y: 0 });

    this.initPanResponder();

    this.state = {
      isZooming: false,
      isZoomVisible: false,
      isOpeningZoom: false,
      orignalImageWidth: 0,
      orignalImageHeight: 0,
      orignalImageX: 0,
      orignalImageY: 0,
      currentIndex: 0,
      currentZoomIndex: 0
    };
  }

  initPanResponder = () => {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return evt.nativeEvent.changedTouches.length > 1;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return evt.nativeEvent.changedTouches.length > 1;
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,

      onPanResponderGrant: (evt, gestureState) => {
        this.lastPinchDistance = undefined;
        this.zoomOpenning = false;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (evt.nativeEvent.changedTouches.length > 1 && !this.zoomOpenning) {
          const distanceX = Math.abs(
            evt.nativeEvent.changedTouches[0].pageX -
              evt.nativeEvent.changedTouches[1].pageX
          );
          const distanceY = Math.abs(
            evt.nativeEvent.changedTouches[0].pageY -
              evt.nativeEvent.changedTouches[1].pageY
          );
          const distance = Math.sqrt(
            distanceX * distanceX + distanceY * distanceY
          );

          if (this.lastPinchDistance === undefined) {
            this.lastPinchDistance = distance;
          } else {
            const distanceDiff = distance - this.lastPinchDistance;
            if (distanceDiff > 5) {
              this.openZoom();
              this.lastPinchDistance = undefined;
              this.zoomOpenning = true;
            }
          }
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }

  goToZoomNext = (vx: number) => {
    const { currentZoomIndex } = this.state;
    const nextIndex =
      currentZoomIndex + 1 > this.props.images.length - 1
        ? this.props.images.length - 1
        : currentZoomIndex + 1;

    this.setState({
      currentZoomIndex: nextIndex
    });

    const nextOffsetX =
      -nextIndex * SCREEN_WIDTH - nextIndex * this.gapSizeScaled;

    this.multiCarousel.goToNext({ animated: false });

    Animated.timing(this.scrollViewPosition, {
      toValue: { x: nextOffsetX, y: 0 },
      easing: APPLE_EASING,
      useNativeDriver: false
    }).start();
  }

  goToZoomPrev = (vx: number) => {
    const { currentZoomIndex } = this.state;
    const nextIndex = currentZoomIndex - 1 < 0 ? 0 : currentZoomIndex - 1;

    this.setState({
      currentZoomIndex: nextIndex
    });

    const nextOffsetX =
      -nextIndex * SCREEN_WIDTH - nextIndex * this.gapSizeScaled;

    this.multiCarousel.goToPrev({ animated: false });

    Animated.timing(this.scrollViewPosition, {
      toValue: { x: nextOffsetX, y: 0 },
      easing: APPLE_EASING,
      useNativeDriver: false
    }).start();
  }

  goToZoomOrigin = () => {
    const { currentZoomIndex } = this.state;
    const nextOffsetX =
      -currentZoomIndex * SCREEN_WIDTH - currentZoomIndex * this.gapSizeScaled;

    Animated.parallel([
      Animated.timing(this.openScale, {
        toValue: 1,
        easing: APPLE_EASING,
        useNativeDriver: false
      }),
      Animated.timing(this.scrollViewPosition, {
        toValue: { x: nextOffsetX, y: 0 },
        easing: APPLE_EASING,
        useNativeDriver: false
      })
    ]).start();
  }

  openZoom = () => {
    const image: any = this.originalImgs[this.state.currentIndex];

    image.measure(
      (ox: number, oy: number, width: number, height: number, px: number, py: number) => {
        this.setState(
          {
            isZoomVisible: true,
            isZooming: true,
            isOpeningZoom: true,
            orignalImageWidth: width,
            orignalImageHeight: height,
            orignalImageX: px,
            orignalImageY: py,
            currentZoomIndex: this.state.currentIndex
          },
          () => {
            const andjustForContainer =
              (this.zoomContainerWidth -
                this.zoomContainerWidth * this.imageWidth / SCREEN_WIDTH) /
              2;

            const peekSize = this.props.peekSize || 0;
            const gapSize = this.props.gapSize || defaultGapSize;
            const offsetWidth = this.props.centerMode
              ? SCREEN_WIDTH - 2 * peekSize - gapSize
              : SCREEN_WIDTH - peekSize;
            this.scrollViewPosition.setValue({
              x:
                -this.state.currentIndex * offsetWidth -
                andjustForContainer +
                px,
              y: (this.imageHeight - SCREEN_HEIGHT) / 2 + HEADER_HEIGHT + py
            });

            Animated.parallel([
              Animated.spring(this.openScale, {
                toValue: 1,
                useNativeDriver: false
              }),
              Animated.spring(this.scrollViewSize, {
                toValue: SCREEN_WIDTH,
                useNativeDriver: false
              }),
              Animated.spring(this.scrollViewPosition, {
                useNativeDriver: false,
                toValue: {
                  x:
                    -this.state.currentIndex * SCREEN_WIDTH -
                    this.state.currentIndex * this.gapSizeScaled,
                  y: 0
                }
              })
            ]).start(() => {
              this.setState({
                isOpeningZoom: false
              });
            });
          }
        );
      }
    );
  }

  closeZoom = () => {
    const andjustForContainer =
      (this.zoomContainerWidth -
        this.zoomContainerWidth * this.imageWidth / SCREEN_WIDTH) /
      2;

    const peekSize = this.props.peekSize || 0;
    const gapSize = this.props.gapSize || defaultGapSize;
    const offsetWidth = this.props.centerMode
      ? SCREEN_WIDTH - 2 * peekSize - gapSize
      : SCREEN_WIDTH - peekSize;

    this.setState(
      {
        isOpeningZoom: true
      },
      () => {
        Animated.parallel([
          Animated.timing(this.openScale, {
            toValue: 0,
            duration: 250,
            easing: APPLE_EASING,
            useNativeDriver: false
          }),
          Animated.timing(this.scrollViewSize, {
            toValue: this.imageWidth,
            duration: 250,
            useNativeDriver: false
          }),
          Animated.timing(this.scrollViewPosition, {
            duration: 250,
            useNativeDriver: false,
            toValue: {
              x:
                -this.state.currentIndex * offsetWidth -
                andjustForContainer +
                this.state.orignalImageX,
              y:
                (this.imageHeight - SCREEN_HEIGHT) / 2 +
                HEADER_HEIGHT +
                this.state.orignalImageY
            }
          })
        ]).start(() => {
          // workaround for blinking by using nativeDriver
          // more: https://github.com/facebook/react-native/issues/10174
          this.setState(
            {
              isZoomVisible: false,
              isOpeningZoom: false
            },
            () => {
              this.setState({
                isZooming: false
              });
            }
          );
        });
      }
    );
  }

  handleItemMoveOutY = (offsetY: number) => {
    const itemSnapX =
      this.state.currentZoomIndex * SCREEN_WIDTH +
      this.state.currentZoomIndex * this.gapSizeScaled;

    const halfScreenHeight = SCREEN_HEIGHT / 2;

    this.scrollViewPosition.setValue({
      x: -itemSnapX,
      y: offsetY
    });
    this.openScale.setValue(
      (halfScreenHeight - Math.abs(offsetY)) / halfScreenHeight
    );
  }

  handleItemMoveOutX = (offsetX: any) => {
    const itemSnapX =
      this.state.currentZoomIndex * SCREEN_WIDTH +
      this.state.currentZoomIndex * this.gapSizeScaled;

    const allItemSnapX =
      (this.props.images.length - 1) * SCREEN_WIDTH +
      (this.props.images.length - 1) * this.gapSizeScaled;

    let scrollViewOffsetX = offsetX - itemSnapX;

    scrollViewOffsetX =
      scrollViewOffsetX > 0 ? scrollViewOffsetX / 3 : scrollViewOffsetX;

    scrollViewOffsetX =
      scrollViewOffsetX < -allItemSnapX
        ? -allItemSnapX + (scrollViewOffsetX + itemSnapX) / 3
        : scrollViewOffsetX;

    this.scrollViewPosition.setValue({
      x: scrollViewOffsetX,
      y: 0
    });

    if (this.lastScrollXStart === null) {
      this.lastScrollXStart = offsetX;
    }
    this.lastScrollX = offsetX;
  }

  handleZoomRelease = (distance: any) => {
    if (distance < -50) {
      this.closeZoom();
    }
  }

  handleMoveRelease = (evt: any, gestureState: any, justMoveX: boolean) => {
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
    } else {
      if (Math.abs(gestureState.dy) > 100 || gestureState.vy > 0.5) {
        this.closeZoom();
      } else {
        this.goToZoomOrigin();
      }
    }
  }

  renderModal = () => {
    const opacityStyle = {
      opacity: this.openScale
    };

    const sizeStyle = {
      transform: [
        { translateY: this.scrollViewPosition.y },
        { translateX: this.scrollViewPosition.x },
        {
          scale: this.scrollViewSize.interpolate({
            inputRange: [this.imageWidth, SCREEN_WIDTH],
            outputRange: [this.imageWidth / SCREEN_WIDTH, 1]
          })
        }
      ]
    };

    if (this.props.renderModalContent) {
      return (
        <Modal
          visible={this.state.isZooming}
          transparent={true}
          onRequestClose={this.closeZoom}
        >
          {this.props.renderModalContent(this.closeZoom)}
        </Modal>
      );
    } else {
      return (
        <Modal
          visible={this.state.isZooming}
          transparent={true}
          onRequestClose={this.closeZoom}
        >
          <ZoomImages
            gapSizeScaled={this.gapSizeScaled}
            zoomContainerWidth={this.zoomContainerWidth}
            images={this.props.images}
            style={{ opacity: this.state.isZoomVisible ? 1 : 0 }}
            opacityStyle={opacityStyle}
            sizeStyle={sizeStyle}
            handleItemMoveOutX={this.handleItemMoveOutX}
            handleItemMoveOutY={this.handleItemMoveOutY}
            handleMoveRelease={this.handleMoveRelease}
            handleZoomRelease={this.handleZoomRelease}
            closeZoom={this.closeZoom}
            goToZoomNext={this.goToZoomNext}
            goToZoomPrev={this.goToZoomPrev}
            currentZoomIndex={this.state.currentZoomIndex}
            showArrow={this.props.showArrow}
            isOpeningZoom={this.state.isOpeningZoom}
            renderCloseButton={this.props.renderCloseButton}
            closeButtonStyle={this.props.closeButtonStyle}
          />

          <Animated.View
            style={[
              S.pageIndicatorZoom,
              opacityStyle,
              this.props.pageIndicatorZoomStyle
            ]}
          >
            {this.props.renderPageIndicator ? (
              this.props.renderPageIndicator(
                this.state.currentIndex,
                this.props.images.length
              )
            ) : (
              <PageIndicator
                currentIndex={this.state.currentIndex}
                itemsCount={this.props.images.length}
                dotStyle={this.props.dotStyle}
                dotActiveStyle={this.props.dotActiveStyle}
              />
            )}
          </Animated.View>
        </Modal>
      );
    }
  }

  handleThumbPress = (i: number) => {
    this.multiCarousel.goTo(i);
  }

  makeHandleThumbPress = (i: number) => () => {
    this.multiCarousel.goTo(i);
  }

  itemUpdated = (oldItem: ImageData, newItem: ImageData, index: number, changed: () => void) => {
    if (newItem.src &&
      ((newItem.src.uri ?
      newItem.src.uri !== oldItem.src.uri :
      newItem.src !== oldItem.src))) {
      changed();
    }
  }

  renderImage = (item: ImageData, index: number) => {
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
        style={{
          paddingRight: this.props.centerMode ? gapSize / 2 : gapSize,
          paddingLeft: this.props.centerMode ? gapSize / 2 : 0
        }}
        key={index}
      >
        <Image
          ref={img => {
            const image: any = img;

            this.originalImgs[index] = image;
          }}
          style={[
            {
              width: this.imageWidth,
              height: this.imageHeight
            },
            this.props.fillContainer ? S.fullHeight : null
          ]}
          source={item.src}
          resizeMode='contain'
        />
      </View>
    );
  }

  handleSlideChange = ({ currentIndex, nextIndex }: any) => {
    this.setState({
      currentIndex: nextIndex
    });
  }

  extractMultiCarousel = (ref: any) => {
    this.multiCarousel = ref;
  }

  renderCarousel = () => {
    const peekSize = this.props.peekSize || 0;
    const gapSize = this.props.gapSize || defaultGapSize;
    return (
      <MultiCarousel
        ref={this.extractMultiCarousel}
        onSlideChange={this.handleSlideChange}
        peekSize={
          peekSize + (this.props.centerMode ? gapSize / 2 : 0)
        }
        itemsPerPage={1}
        items={this.props.images}
        itemUpdated={this.itemUpdated}
        renderItem={this.renderImage}
        showArrow={this.props.showArrow}
        dotStyle={this.props.dotStyle}
        dotActiveStyle={this.props.dotActiveStyle}
        pageIndicatorStyle={this.props.pageIndicatorStyle}
        zoomButtonStyle={this.props.zoomButtonStyle}
        renderPageIndicator={this.props.renderPageIndicator}
        centerMode={this.props.centerMode}
        style={this.props.fillContainer ? S.fullHeight : null}
        nextArrowOnBlur={this.props.nextArrowOnBlur}
        contentContainerStyle={this.props.contentContainerStyle}
      />
    );
  }

  render(): JSX.Element {
    return (
      <View style={this.props.fillContainer ? S.fullHeight : null}>
        <View style={this.props.fillContainer ? S.fullHeight : null}>
          <View
            style={this.props.fillContainer ? S.fullHeight : null}
            {...this.panResponder.panHandlers}
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
                  style={S.zoomButton}
                  onPress={this.openZoom}
                  accessibilityRole={'button'}
                  accessibilityLabel={FSI18n.string(componentTranslationKeys.fullscreen.actionBtn)}
                >
                  <Image style={S.searchIcon} source={searchIcon} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {this.props.showThumbnails &&
          (this.props.renderThumbnails ? (
            this.props.renderThumbnails(
              this.state.currentIndex,
              this.handleThumbPress
            )
          ) : (
            <ScrollView
              horizontal={true}
              contentContainerStyle={[
                S.thumbnailContainer,
                this.props.thumbnailContainerStyle
              ]}
            >
              {this.props.images.map((img, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    S.thumbnail,
                    this.props.thumbnailStyle,
                    this.state.currentIndex === i && S.thumbnailSelected
                  ]}
                  onPress={this.makeHandleThumbPress(i)}
                  accessibilityRole={'button'}
                  accessibilityLabel={FSI18n.string(componentTranslationKeys.focus.actionBtn)}
                >
                  <Image
                    resizeMode='cover'
                    source={img.src}
                    style={S.thumbnailImg}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ))}
      </View>
    );
  }
}
