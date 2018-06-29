/**
 * what's special about this carousel
 * - two states: normal carosuel, zoomed carousel
 * - pinch zoom on normal carouse: trigger zoomed carosuel
 * - pinch zoom on zoomed caousuel and release: restore back too zoomed carousel
 */

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { ZoomCarouselProps } from './types';
import { MultiCarousel } from '../MultiCarousel';
import { PhotoSwipe } from './PhotoSwipe.web';

const searchIcon = require('../../../assets/images/search.png');

let ZOOM_CAROUSEL_ID = 0;

type ImageGetSize = (
  uri: string,
  success: (width: number, height: number) => void,
  failure: (error: any) => void
) => any;

// @ts-ignore @types/react-native does not correctly define Image.getSize as a static method.
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
  }
});

export class ZoomCarousel extends Component<ZoomCarouselProps, ZoomCarouselStateType> {
  static defaultProps: ZoomCarouselProps = {
    images: [],
    peekSize: 0,
    gapSize: 0
  };
  multiCarousel: any;
  id: number;

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
      screenWidth
    };

    // get the image ratio
    props.images.forEach((img, i) => {
      const uri = img.src.uri;

      if (uri) {
        getSize(uri, (width, height) => {
          const imageSizes = this.state.imageSizes;
          imageSizes[i] = { width, height };
          this.setState({
            imageSizes
          });
        }, err => {
          console.warn('image getSize failed', err);
        });
      }
    });
  }

  goToNext = () => {
    this.multiCarousel.goToNext();
  }

  goToPrev = () => {
    this.multiCarousel.goToPrev();
  }

  openZoom = () => {
    this.setState({
      isZooming: true
    });
  }

  closeZoom = () => {
    this.setState({
      isZooming: false
    });
  }

  handleSlideChange = ({ currentIndex, nextIndex }: any) => {
    this.setState({
      currentIndex: nextIndex
    });
  }

  handleZoomCarouselChange = (pswp: any) => {
    const currentIndex = pswp.getCurrentIndex();
    this.setState({ currentIndex });
    this.multiCarousel.goTo(currentIndex);
  }

  handleLayoutChange = (e: any) => {
    const { centerMode, peekSize = 0, gapSize = 0 } = this.props;
    const screenWidth = Dimensions.get('window').width;

    const itemWidth = centerMode
      ? screenWidth - 2 * peekSize - gapSize
      : screenWidth - peekSize;
    const imageWidth = itemWidth - gapSize;
    const imageHeight = itemWidth - gapSize;

    this.setState({
      imageWidth,
      imageHeight,
      screenWidth
    });
  }

  goTo = (i: number) => {
    this.multiCarousel.goTo(i);
  }

  handleThumbPress = (i: number) => () => {
    this.goTo(i);
  }

  extractMultiCarousel = (ref: any) => {
    this.multiCarousel = ref;
  }

  renderImage = (item: any) => {
    return (
      <View>
        <Image
          source={item.src}
          resizeMode='contain'
          style={{
            width: this.state.imageWidth,
            height: this.state.imageHeight
          }}
        />
      </View>
    );
  }

  render(): JSX.Element {
    const { peekSize = 0, gapSize = 0 } = this.props;

    return (
      <View onLayout={this.handleLayoutChange}>
        <View>
          <div id={`zoom-carousel-${this.id}`}>
            <MultiCarousel
              ref={this.extractMultiCarousel}
              onSlideChange={this.handleSlideChange}
              peekSize={peekSize + (this.props.centerMode ? gapSize / 2 : 0)}
              itemsPerPage={1}
              items={this.props.images}
              renderItem={this.renderImage}
              showArrow={this.props.showArrow}
              dotStyle={this.props.dotStyle}
              dotActiveStyle={this.props.dotActiveStyle}
              pageIndicatorStyle={this.props.pageIndicatorStyle}
              zoomButtonStyle={this.props.zoomButtonStyle}
              renderPageIndicator={this.props.renderPageIndicator}
              centerMode={this.props.centerMode}
            />

            <View style={[S.zoomButtonContainer, this.props.zoomButtonStyle]}>
              {this.props.renderZoomButton ? (
                this.props.renderZoomButton(this.openZoom)
              ) : (
                <TouchableOpacity style={S.zoomButton} onPress={this.openZoom}>
                  <Image style={S.searchIcon} source={searchIcon} />
                </TouchableOpacity>
              )}
            </View>

            <PhotoSwipe
              isOpen={this.state.isZooming}
              items={this.props.images
                .map(img => img.zoomSrc || img.src)
                .map((img, i) => ({
                  src: img.uri || img,
                  w: this.state.screenWidth,
                  h: this.state.imageSizes[i]
                    ? this.state.screenWidth *
                      this.state.imageSizes[i].height /
                      this.state.imageSizes[i].width
                    : this.state.imageHeight
                }))}
              options={{
                loop: false,
                fullscreenEl: false,
                shareEl: false,
                captionEl: false,
                history: false,
                closeOnScroll: false,
                index: this.state.currentIndex
              }}
              afterChange={this.handleZoomCarouselChange}
              onClose={this.closeZoom}
            />
          </div>
        </View>

        {this.props.showThumbnails &&
          (this.props.renderThumbnails ? (
            this.props.renderThumbnails(this.state.currentIndex, this.goTo)
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
                  onPress={this.handleThumbPress(i)}
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
