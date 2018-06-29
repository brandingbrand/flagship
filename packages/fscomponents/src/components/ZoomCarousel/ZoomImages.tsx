import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

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
  closeZoom: {
    position: 'absolute',
    top: 30,
    left: 10,
    zIndex: 100
  },
  scrollViewContainer: {
    flex: 1
  },
  customScrollView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  scrollViewZoomBG: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white'
  },
  goToZoomNext: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT / 2 - 15,
    right: 0,
    zIndex: 100,
    padding: 10
  },
  goToZoomPrev: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT / 2 - 15,
    left: 0,
    zIndex: 100,
    padding: 10
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
  },
  closeButtonIcon: {
    width: 35,
    height: 35,
    paddingTop: 15
  },
  closeButtonLeft: {
    width: 35,
    height: 1,
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#555'
  },
  closeButtonRight: {
    width: 35,
    height: 1,
    transform: [{ rotate: '135deg' }],
    backgroundColor: '#555'
  }
});

export class ZoomImages extends Component<ZoomImagesProps> {
  render(): JSX.Element {
    const {
      style,
      opacityStyle,
      sizeStyle,
      handleItemMoveOutX,
      handleItemMoveOutY,
      handleMoveRelease,
      handleZoomRelease,
      closeZoom,
      goToZoomNext,
      goToZoomPrev,
      images,
      zoomContainerWidth,
      gapSizeScaled,
      currentZoomIndex,
      showArrow,
      isOpeningZoom,
      renderCloseButton,
      closeButtonStyle
    } = this.props;

    return (
      <View style={[{ flex: 1 }, style]}>
        <Animated.View style={[S.scrollViewZoomBG, opacityStyle]} />
        <View style={S.scrollViewContainer}>
          <Animated.View
            style={[
              S.customScrollView,
              { width: zoomContainerWidth },
              sizeStyle
            ]}
          >
            {images.map((item: any, i: number) => {
              return (
                <ZoomCarouselItem
                  key={i}
                  style={{
                    marginRight: i !== images.length ? gapSizeScaled : 0,
                    opacity: isOpeningZoom && currentZoomIndex !== i ? 0 : 1
                  }}
                  onItemMoveOutX={handleItemMoveOutX}
                  onItemMoveOutY={handleItemMoveOutY}
                  onMoveRelease={handleMoveRelease}
                  onZoomRelease={handleZoomRelease}
                >
                  <Image
                    style={{
                      width: SCREEN_WIDTH,
                      height: SCREEN_WIDTH
                    }}
                    source={item.zoomSrc || item.src}
                    resizeMode='contain'
                  />
                </ZoomCarouselItem>
              );
            })}
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

          {currentZoomIndex !== 0 &&
            !!showArrow && (
              <Animated.View style={opacityStyle}>
                <TouchableOpacity style={S.goToZoomPrev} onPress={goToZoomPrev}>
                  <View style={S.buttonPrevIcon} />
                </TouchableOpacity>
              </Animated.View>
            )}
          {currentZoomIndex !== images.length - 1 &&
            !!showArrow && (
              <Animated.View style={opacityStyle}>
                <TouchableOpacity style={S.goToZoomNext} onPress={goToZoomNext}>
                  <View style={S.buttonNextIcon} />
                </TouchableOpacity>
              </Animated.View>
            )}
        </View>
      </View>
    );
  }
}
