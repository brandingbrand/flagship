import React, { Component } from 'react';

import { Animated, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ZoomCarouselItem } from './ZoomCarouselItem';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export interface ZoomImagesProps {
  style?: any;
  opacityStyle?: any;
  sizeStyle?: any;
  handleItemMoveOutX?: any;
  handleItemMoveOutY?: any;
  handleMoveRelease?: any;
  handleZoomRelease?: any;
  closeZoom?: any;
  goToZoomNext?: any;
  goToZoomPrev?: any;
  images?: any;
  zoomContainerWidth?: any;
  gapSizeScaled?: any;
  currentZoomIndex?: any;
  showArrow?: any;
  isOpeningZoom?: any;
  renderCloseButton?: any;
  closeButtonStyle?: any;
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
  closeButtonIcon: {
    height: 35,
    paddingTop: 15,
    width: 35,
  },
  closeButtonLeft: {
    backgroundColor: '#555',
    height: 1,
    transform: [{ rotate: '45deg' }],
    width: 35,
  },
  closeButtonRight: {
    backgroundColor: '#555',
    height: 1,
    transform: [{ rotate: '135deg' }],
    width: 35,
  },
  closeZoom: {
    left: 10,
    position: 'absolute',
    top: 30,
    zIndex: 100,
  },
  customScrollView: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  goToZoomNext: {
    bottom: SCREEN_HEIGHT / 2 - 15,
    padding: 10,
    position: 'absolute',
    right: 0,
    zIndex: 100,
  },
  goToZoomPrev: {
    bottom: SCREEN_HEIGHT / 2 - 15,
    left: 0,
    padding: 10,
    position: 'absolute',
    zIndex: 100,
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollViewZoomBG: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
});

export class ZoomImages extends Component<ZoomImagesProps> {
  public render(): JSX.Element {
    const {
      closeButtonStyle,
      closeZoom,
      currentZoomIndex,
      gapSizeScaled,
      goToZoomNext,
      goToZoomPrev,
      handleItemMoveOutX,
      handleItemMoveOutY,
      handleMoveRelease,
      handleZoomRelease,
      images,
      isOpeningZoom,
      opacityStyle,
      renderCloseButton,
      showArrow,
      sizeStyle,
      style,
      zoomContainerWidth,
    } = this.props;

    return (
      <View style={[{ flex: 1 }, style]}>
        <Animated.View style={[S.scrollViewZoomBG, opacityStyle]} />
        <View style={S.scrollViewContainer}>
          <Animated.View style={[S.customScrollView, { width: zoomContainerWidth }, sizeStyle]}>
            {images.map((item: any, i: number) => (
              <ZoomCarouselItem
                key={i}
                onItemMoveOutX={handleItemMoveOutX}
                onItemMoveOutY={handleItemMoveOutY}
                onMoveRelease={handleMoveRelease}
                onZoomRelease={handleZoomRelease}
                style={{
                  marginRight: i !== images.length ? gapSizeScaled : 0,
                  opacity: isOpeningZoom && currentZoomIndex !== i ? 0 : 1,
                }}
              >
                <Image
                  resizeMode="contain"
                  source={item.zoomSrc || item.src}
                  style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_WIDTH,
                  }}
                />
              </ZoomCarouselItem>
            ))}
          </Animated.View>

          <Animated.View style={[S.closeZoom, opacityStyle, closeButtonStyle]}>
            {renderCloseButton ? (
              renderCloseButton(closeZoom)
            ) : (
              <TouchableOpacity onPress={closeZoom}>
                <View style={S.closeButtonIcon}>
                  <View style={S.closeButtonLeft} />
                  <View style={S.closeButtonRight} />
                </View>
              </TouchableOpacity>
            )}
          </Animated.View>

          {currentZoomIndex !== 0 && Boolean(showArrow) && (
            <Animated.View style={opacityStyle}>
              <TouchableOpacity onPress={goToZoomPrev} style={S.goToZoomPrev}>
                <View style={S.buttonPrevIcon} />
              </TouchableOpacity>
            </Animated.View>
          )}
          {currentZoomIndex !== images.length - 1 && Boolean(showArrow) && (
            <Animated.View style={opacityStyle}>
              <TouchableOpacity onPress={goToZoomNext} style={S.goToZoomNext}>
                <View style={S.buttonNextIcon} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    );
  }
}
