/* tslint:disable */
import React, { PureComponent } from 'react';
import {
  Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import * as Animatable from 'react-native-animatable';
import {
  ScreenProps
} from './types';

// const ENTRIES2 = [
//   {
//     title: 'Favourites landscapes 1',
//     subtitle: 'Lorem ipsum dolor sit amet',
//     illustration: 'https://i.imgur.com/SsJmZ9jl.jpg'
//   },
//   {
//     title: 'Favourites landscapes 2',
//     subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
//     illustration: 'https://i.imgur.com/5tj6S7Ol.jpg'
//   },
//   {
//     title: 'Favourites landscapes 3',
//     subtitle: 'Lorem ipsum dolor sit amet et nuncat',
//     illustration: 'https://i.imgur.com/pmSqIFZl.jpg'
//   },
//   {
//     title: 'Favourites landscapes 4',
//     subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
//     illustration: 'https://i.imgur.com/cA8zoGel.jpg'
//   },
//   {
//     title: 'Favourites landscapes 5',
//     subtitle: 'Lorem ipsum dolor sit amet',
//     illustration: 'https://i.imgur.com/pewusMzl.jpg'
//   },
//   {
//     title: 'Favourites landscapes 6',
//     subtitle: 'Lorem ipsum dolor sit amet et nuncat',
//     illustration: 'https://i.imgur.com/l49aYS3l.jpg'
//   }
// ];
const simpleCloseIcn = require('../assets/images/simple-close-icn.png');
const stars = require('../assets/images/stars.png');
const share = require('../assets/images/share-icn.png');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage: number) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
const IS_IOS = Platform.OS === 'ios';
const slideHeight = viewportHeight * .95;
const slideWidth = wp(93);
const itemHorizontalMargin = wp(1);
const entryBorderRadius = 12;

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const styles = StyleSheet.create({
  growStretch: {
    alignSelf: 'stretch',
    flexGrow: 1
  },
  closeButtonContainer: {
    position: 'absolute',
    zIndex: 100,
    top: 15,
    left: 15,
    padding: 10
  },
  simpleCloseIcn: {
    width: 20,
    height: 20
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: 'row'
  },
  secondaryButtonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 5
  },
  stars: {
    width: 100,
    height: 22
  },
  share: {
    width: 30,
    height: 30
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, .65)'
  },
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin
  },
  itemContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    // borderTopLeftRadius: entryBorderRadius,
    // borderTopRightRadius: entryBorderRadius,
    borderRadius: entryBorderRadius
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },
  brand: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: '400',
    marginBottom: 3
  },
  title: {
    color: '#000',
    fontSize: 15,
    fontFamily: 'Helvetica',
    fontWeight: '500'
  },
  price: {
    marginTop: 6,
    color: '#000',
    fontSize: 14,
    fontFamily: 'Helvetica',
    fontWeight: '600'
  },
  topContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    paddingBottom: 40
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius
  },
  backButton: {
    position: 'absolute',
    zIndex: 10,
    top: 50,
    left: 8,
    padding: 12
  },
  backIcon: {
    width: 14,
    height: 25
  }
});
const imageWidth = 150;


// const backArrow = require('../assets/images/backArrow.png');

export interface EngagementProductModalProps extends ScreenProps {
  products: any[];
  index: number;
}
export interface EngagementProductModalState {
  scrollEnabled: boolean;
}

export default class EngagementProductModal extends
  PureComponent<EngagementProductModalProps, EngagementProductModalState> {
  constructor(props: EngagementProductModalProps) {
    super(props);
    this.state = {
      scrollEnabled: true
    }
  //  this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  // onNavigatorEvent = (event: any) => {
  //   if (event.type === 'NavBarButtonPress') {
  //     if (event.id === 'close') {
  //       this.props.navigator.dismissModal();
  //     }
  //   }
  // }
  scrollPosition: number = 0;
  zoomedIn: boolean = false;
  AnimatedModal: any;
  //AnimatedProduct: any;
  AnimatedContent: any;
  //handleProductContainerRef = (ref: any) => this.AnimatedProduct = ref;
  componentDidMount(): void {
    if (this.AnimatedModal) {
      this.AnimatedModal.transition(
        { opacity: 0 },
        { opacity: 1 },
        300, 'linear');
    }
    if (this.AnimatedContent) {
      setTimeout(() => {
        this.AnimatedContent.transition(
          { translateX: viewportWidth },
          { translateX: 0 },
          600, 'ease-in-out-quart');
      }, 0);
    }
  }
  handleAnimatedRef = (ref: any) => this.AnimatedModal = ref;
  handleAnimatedContentRef = (ref: any) => this.AnimatedContent = ref;
  onBackPress = (): void => {
    this.props.navigator.pop();
  }
  onBuyPress = () => {

  }
  onScrollCarouselItem = (event: any) => {
    this.scrollPosition = event.nativeEvent.contentOffset.y;
    console.log(this.scrollPosition)
    // console.log(this.props.AnimatedImage)
    // if (this.props.AnimatedImage && event.nativeEvent.contentOffset.y < 0) {

    // }
    if (this.scrollPosition > 15 && !this.zoomedIn) {
      if (this.AnimatedContent) {
        this.zoomedIn = true;
        this.setState({ scrollEnabled: false });
        this.AnimatedContent.transitionTo(
          { translateY: -20, scale: 1.08 },
          400, 'ease-out');
      }
    } else if (this.scrollPosition <= 15 && this.zoomedIn) {
      if (this.AnimatedContent) {
        this.zoomedIn = false;
        this.setState({ scrollEnabled: true });
        this.AnimatedContent.transitionTo(
          { translateY: 0, scale: 1 },
          400, 'ease-out');
      }
    }
    // if (!this.state.showDarkX && event.nativeEvent.contentOffset.y >= 378) {
    //   this.setState({ showDarkX: true });
    // } else if (this.state.showDarkX && event.nativeEvent.contentOffset.y < 378) {
    //   this.setState({ showDarkX: false });
    // }
    // if (!this.state.slideBackground && event.nativeEvent.contentOffset.y >= 100) {
    //   this.setState({ slideBackground: true });
    // }

  }
  _renderItem = (data: any) => {
    const { item } = data;

    console.log(item)
    const imageStyle: any = {
      width: imageWidth,
      height: imageWidth / parseFloat(item.image.ratio),
      marginBottom: 10
    };
    return (
      <View
        style={styles.slideInnerContainer}
      >
        <View
          style={[styles.itemContainer]}
        >
          <TouchableOpacity
            style={styles.closeButtonContainer}
            activeOpacity={1}
            onPress={this.closeModal}
          >
            <Image
              resizeMode='contain'
              source={simpleCloseIcn}
              style={styles.simpleCloseIcn}
            />
          </TouchableOpacity>
          <ScrollView
            onScroll={this.onScrollCarouselItem}
            scrollEventThrottle={16}
          >

          <View style={styles.topContentContainer}>
            <Image
              source={item.image.source}
              style={imageStyle}
            />
            <Text
              style={styles.brand}
            >
              {item.brand}
            </Text>
            <Text
              style={styles.title}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              style={styles.price}
            >
              {item.price}
            </Text>
            <View style={styles.starContainer}>
              <View style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'center'
              }}>
                <Image
                  source={stars}
                  style={styles.stars}
                />
                <Text style={{ fontSize: 12, color: '#999' }}>
                  {item.reviewCount} Ratings
                </Text>
              </View>
              <View style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}>
                <Image
                  source={share}
                  style={styles.share}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                activeOpacity={.6}
                onPress={this.onBuyPress}
                style={{
                  flex: 1,
                  backgroundColor: '#000',
                  borderRadius: 20,
                  height: 40
                }}
              >
                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 'bold'
                  }}>
                    BUY | {item.price}
                  </Text>

                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.secondaryButtonContainer}>
              <View style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'center'
              }}>
                <Text style={{ fontSize: 12, color: '#777' }}>
                  Available to ship now
                </Text>
              </View>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}>
                <TouchableOpacity
                  activeOpacity={.6}
                  onPress={this.onBuyPress}
                  style={{
                    flex: 1,
                    backgroundColor: '#FFF',
                    borderRadius: 20,
                    height: 40,
                    borderWidth: 2,
                    borderColor: '#000'
                  }}
                >
                  <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text style={{
                      color: '#000',
                      fontSize: 13,
                      fontWeight: 'bold'
                    }}>
                      ADD TO WISHLIST
                    </Text>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{

            }}>
              <Text style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: '#000',
                marginBottom: 10
              }}>
                Product Description
                </Text>
              <Text style={{
                fontSize: 13,
                fontWeight: 'normal',
                color: '#000'
              }}>
                {item.productInfo}
              </Text>
              <Text style={{
                marginTop: 20,
                fontSize: 13,
                fontWeight: 'normal',
                color: '#000'
              }}>
                {item.productInfo}
              </Text>
              <Text style={{
                marginTop: 20,
                fontSize: 13,
                fontWeight: 'normal',
                color: '#000'
              }}>
                {item.productInfo}
              </Text>
            </View>
          </View>
              </ScrollView>
        </View>
      </View>
    );
  }
  closeModal = () => {
    if (this.AnimatedContent) {
      this.AnimatedContent.transition(
        { translateX: 0 },
        { translateX: viewportWidth },
        600, 'ease-in-out-quart');
    }
    setTimeout(() => {
      if (this.AnimatedModal) {
        this.AnimatedModal.transition(
          { opacity: 1 },
          { opacity: 0 },
          300, 'linear');
      }
    }, 300)

    setTimeout(() => {
      this.props.navigator.dismissModal({
        animationType: 'none'
      });
    }, 650);
  }
  onSnapToItem = (index: number): void => {
    console.log(index)
  }
  render(): JSX.Element {
    const { products } = this.props;
    console.log(products)
    return (
      <View style={styles.growStretch}>
        <Animatable.View
          ref={this.handleAnimatedRef}
          useNativeDriver
          style={styles.background}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={this.closeModal}
          />
        </Animatable.View>
        <Animatable.View
          ref={this.handleAnimatedContentRef}
          useNativeDriver
          style={{
            marginTop: 50,
            transform: [
              { translateX: viewportWidth }
            ]
          }}>
          <Carousel
            data={products || []}
            layout={'default'}
            firstItem={this.props.index || 0}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            scrollEnabled={this.state.scrollEnabled}
            renderItem={this._renderItem}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
            onSnapToItem={this.onSnapToItem}
            useScrollView={false}
          />
        </Animatable.View>

      </View>
    );
  }
}
