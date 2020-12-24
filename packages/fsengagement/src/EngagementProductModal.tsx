/* tslint:disable */
import React, { PureComponent } from 'react';
import {
  Dimensions, Image, ImageStyle, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import * as Animatable from 'react-native-animatable';
import { Navigator } from '@brandingbrand/fsapp';
import {
  ScreenProps
} from './types';

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
  categoryHeader: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Optima-Bold'
  },
  secondaryButtonContainer: {
    marginTop: 20,
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
  starsSmall: {
    width: 50,
    height: 11
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
    paddingHorizontal: 25,
    fontSize: 17,
    lineHeight: 18,
    color: '#000',
    fontFamily: 'Optima-Bold',
    textAlign: 'center'
  },
  price: {
    marginTop: 6,
    color: '#000',
    fontSize: 13,
    fontFamily: 'Helvetica',
    fontWeight: '400'
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
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 20,
    height: 40
  },
  alignStart: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  alignEnd: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold'
  },
  wishlistButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 40,
    borderWidth: 2,
    borderColor: '#000'
  },
  wishlistText: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold'
  },
  regularText: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#000'
  },
  seeAll: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Helvetica'
  },
  prodCatBorder: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 20,
    marginTop: 20
  },
  reviewContainer: {
    padding: 10,
    backgroundColor: '#f1f1f1'
  },
  reviewTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4
  },
  reviewText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000'
  },
  reviewDate: {
    flex: 1,
    marginLeft: 5,
    fontSize: 11,
    color: '#999'
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
  navigator: Navigator;

  constructor(props: EngagementProductModalProps) {
    super(props);
    this.state = {
      scrollEnabled: true
    }
    this.navigator = new Navigator({
      componentId: props.componentId,
      tabs: []
    });
  }

  scrollPosition: number = 0;
  zoomedIn: boolean = false;
  AnimatedModal: any;
  AnimatedContent: any;
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
          { translateY: viewportHeight },
          { translateY: 0 },
          600, 'ease-in-out-quart');
      }, 0);
    }
  }
  handleAnimatedRef = (ref: any) => this.AnimatedModal = ref;
  handleAnimatedContentRef = (ref: any) => this.AnimatedContent = ref;
  onBackPress = (): void => {
    this.navigator.pop();
  }
  onBuyPress = () => {

  }
  onScrollCarouselItem = (event: any) => {
    this.scrollPosition = event.nativeEvent.contentOffset.y;

    if (this.scrollPosition > 15 && !this.zoomedIn) {
      if (this.AnimatedContent) {
        this.zoomedIn = true;
        this.setState({ scrollEnabled: false });
        this.AnimatedContent.transitionTo(
          { translateY: -30, scale: 1.08 },
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
  }
  _renderItem = (data: any) => {
    const { item } = data;
    const imageStyle: ImageStyle = {
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
              <View style={styles.alignStart}>
                <Image
                  source={stars}
                  style={styles.stars}
                />
                <Text style={{ fontSize: 12, color: '#999' }}>
                  {item.reviewCount} Ratings
                </Text>
              </View>
              <View style={styles.alignEnd}>
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
                style={styles.buyButton}
              >
                <View style={styles.alignCenter}>
                  <Text style={styles.buttonText}>
                    BUY | {item.price}
                  </Text>

                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.secondaryButtonContainer}>
              <View style={styles.alignStart}>
                <Text style={{ fontSize: 12, color: '#777' }}>
                  Available to ship now
                </Text>
              </View>
              <View style={[styles.alignEnd, { flexDirection: 'row' }]}>
                <TouchableOpacity
                  activeOpacity={.6}
                  onPress={this.onBuyPress}
                  style={styles.wishlistButton}
                >
                  <View style={styles.alignCenter}>
                    <Text style={styles.wishlistText}>
                      ADD TO WISHLIST
                    </Text>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ paddingBottom: 30 }}>
              <Text style={[styles.categoryHeader, { marginBottom: 10 }]}>
                Product Description
              </Text>
              <Text style={styles.regularText}>
                {item.productInfo}
              </Text>
                <View style={styles.prodCatBorder} />
                <Text
                  style={[styles.categoryHeader, {
                    marginBottom: 10,
                    marginTop: 20,
                  }]}
                >
                  Product Features
              </Text>
                <Text style={styles.regularText}>
                  {item.features}
                </Text>
                <View style={[styles.prodCatBorder, { paddingHorizontal: 30 }]} />
                <View style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                  marginTop: 20,
                }}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.categoryHeader}>
                      Customer Reviews
                    </Text>
                  </View>
                  <View style={styles.alignEnd}>
                    <Text style={styles.seeAll}>
                      See All
                    </Text>
                  </View>
                </View>

              {item.review && <View style={styles.reviewContainer}>
                  <Text style={styles.reviewTitle}>
                    Awesome Product!
                  </Text>
                  <Text style={styles.reviewText}>
                    {item.review}
                  </Text>
                  <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={stars}
                    style={styles.starsSmall}
                  />
                  <Text style={styles.reviewDate}>
                    Dec 5, 2019
                  </Text>
                </View>
              </View>}

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
        { translateY: 0 },
        { translateY: viewportHeight },
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
      this.navigator.dismissModal({
        animations: {
          dismissModal: {
            enabled: false
          }
        }
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
          useNativeDriver={false}
          style={styles.background}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={this.closeModal}
          />
        </Animatable.View>
        <Animatable.View
          ref={this.handleAnimatedContentRef}
          useNativeDriver={false}
          style={{
            marginTop: 50,
            transform: [
              { translateY: viewportHeight }
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
