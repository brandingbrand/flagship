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
import RenderImageTextItem from '../carousel/RenderImageTextItem';

import {
  CardProps
} from '../types';
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
  headerStyle?: any;
  textStyle?: any;
  pageCounterStyle?: StyleProp<ViewStyle>;
  pageNumberStyle?: StyleProp<TextStyle>;
}

export interface ImageCarouselBlockState {
  width?: number;
  height?: number;
  sliderActiveSlide: number;
  overallHeight: number;
}
// extends CardProps
export default class ImageCarouselBlock
  extends Component<ImageCarouselBlockProps, ImageCarouselBlockState> {
  // readonly state: ImageCarouselBlockState = {};
  _slider1Ref: any | null = null;
  constructor(props: ImageCarouselBlockProps) {
    super(props);
    this.state = {
      sliderActiveSlide: SLIDER_1_FIRST_ITEM,
      overallHeight: 0
    };
  }

  shouldComponentUpdate(nextProps: ImageCarouselBlockProps, nextState: ImageCarouselBlockState): boolean {
    return this.props.containerStyle !== nextProps.containerStyle ||
      this.props.items !== nextProps.items ||
      this.props.ratio !== nextProps.ratio ||
      this.props.options !== nextProps.options ||
      this.props.resizeMode !== nextProps.resizeMode ||
      this.props.source !== nextProps.source ||
      this.props.headerStyle !== nextProps.headerStyle ||
      this.props.textStyle !== nextProps.textStyle ||
      this.state.overallHeight !== nextState.overallHeight;
  }
  _renderItem(data: any): JSX.Element {
    const {
      headerStyle,
      textStyle,
      options
    } = this.props;
    let renderItemWidth = this.calculateItemWidth();
    return (
      <RenderImageTextItem
        data={data.item}
        key={data.index}
        overallHeight={this.state.overallHeight}
        itemWidth={renderItemWidth}
        horizPadding={options.itemHorizontalPaddingPercent}
        options={options}
        headerStyle={headerStyle}
        textStyle={textStyle}
        even={false}
      />
    );
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

    const slideWidth = Math.round((this.calculateSliderWidth() * options.itemWidthPercent) / 100);
    return slideWidth + options.itemHorizontalPaddingPercent;
    // const slideWidth = wp(options.itemWidthPercent);
    // const itemHorizontalMargin = wp(options.itemHorizontalPaddingPercent);
    // return slideWidth + itemHorizontalMargin * 2 - this.horizontalMarginPadding();
  }

// const slideWidth = Math.round((calculateSliderWidth() * options.itemWidthPercent) / 100);
// return slideWidth;
  createCarousel(): JSX.Element {
    const {
      items,
      options
    } = this.props;

    let renderItemWidth = this.calculateItemWidth();
    return (
      <Carousel
        data={items}
        renderItem={this._renderItem.bind(this)}
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
