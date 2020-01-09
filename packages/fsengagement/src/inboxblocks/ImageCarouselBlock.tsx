// tslint:disable
import React, { Component } from 'react';
import {
  Dimensions,
  ImageStyle,
  ImageURISource,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import styles from '../carousel/index.style';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth } = Dimensions.get('window');
const SLIDER_1_FIRST_ITEM = 1;
const sliderWidth = viewportWidth;
let renderItemOptions: any = {};
let renderItemWidth: number = 0;
import { wp } from '../carousel/SliderEntry.style';
import RenderItem from '../carousel/RenderItem';

import {
  CardProps
} from '../types';
let navigator: any;
export interface ImageCarouselBlockProps extends CardProps {
  source: ImageURISource;
  resizeMode?: any;
  resizeMethod?: any;
  items: any;
  options: any;
  ratio?: string;
  useRatio?: boolean;
  pageCounter?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: any;
  pageCounterStyle?: StyleProp<ViewStyle>;
  pageNumberStyle?: StyleProp<TextStyle>;
}

export interface ImageCarouselBlockState {
  width?: number;
  height?: number;
  sliderActiveSlide: number;
}
// extends CardProps
export default class ImageCarouselBlock
  extends Component<ImageCarouselBlockProps, ImageCarouselBlockState> {
  // readonly state: ImageCarouselBlockState = {};
  _slider1Ref: any | null = null;
  constructor(props: ImageCarouselBlockProps) {
    super(props);
    this.state = {
      sliderActiveSlide: SLIDER_1_FIRST_ITEM
    };
  }

  componentDidMount(): void {
    navigator = this.props.navigator;
  }
  _renderItem(data: any): JSX.Element {
    return <RenderItem
      data={data.item}
      index={data.index}
      navigator={navigator}
      horizPadding={wp(renderItemOptions.itemHorizontalPaddingPercent)}
      itemWidth={renderItemWidth}
      even={false}
    />;
  }

  horizontalMarginPadding() {
    const {
      containerStyle
    } = this.props;
    const ml = containerStyle.marginLeft || 0;
    const mr = containerStyle.marginRight || 0;
    const pr = containerStyle.paddingRight || 0;
    const pl = containerStyle.paddingLeft || 0;
    return ml + mr + pr + pl;
  }
  calculateSliderWidth() {
    return sliderWidth - this.horizontalMarginPadding();
  }
  calculateItemWidth() {
    const {
      options
    } = this.props;
    const slideWidth = wp(options.itemWidthPercent);
    const itemHorizontalMargin = wp(options.itemHorizontalPaddingPercent);
    return slideWidth + itemHorizontalMargin * 2 - this.horizontalMarginPadding();
  }
  createCarousel(): JSX.Element {
    const {
      items,
      options
    } = this.props;
    renderItemOptions = options;
    renderItemWidth = this.calculateItemWidth();
    return (
      <Carousel
        data={items}
        renderItem={this._renderItem}
        hasParallaxImages={false}
        sliderWidth={this.calculateSliderWidth()}
        itemWidth={renderItemWidth}
        inactiveSlideScale={options.inactiveSlideScale}
        inactiveSlideOpacity={options.inactiveSlideOpacity}
        enableMomentum={true}
        activeSlideAlignment={options.activeSlideAlignment}
        containerCustomStyle={styles.slider}
        contentContainerCustomStyle={styles.sliderContentContainer}
        activeAnimationType={'spring'}
        onSnapToItem={(index) => this.setState({ sliderActiveSlide: index + 1 })}
      />
    );
  }
  render(): JSX.Element {
    const {
      containerStyle,
      items,
      pageCounter,
      pageCounterStyle,
      pageNumberStyle
    } = this.props;

    const carousel = this.createCarousel();

    return (
      <View style={containerStyle}>
        {carousel}
        {pageCounter && <View style={[styles.pageCounter, pageCounterStyle]}>
          <Text
            style={[styles.pageNum, pageNumberStyle]}
          >
            {this.state.sliderActiveSlide} / {items.length}
          </Text>
        </View>}
      </View>
    );
  }
}
