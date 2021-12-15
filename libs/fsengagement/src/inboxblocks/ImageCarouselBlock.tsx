/* eslint-disable */
import React, { Component } from 'react';
import {
  Dimensions,
  ImageStyle,
  ImageURISource,
  LayoutChangeEvent,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import styles from '../carousel/index.style';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth } = Dimensions.get('window');
const SLIDER_1_FIRST_ITEM = 1;
const sliderWidth = viewportWidth;
import RenderImageTextItem from '../carousel/RenderImageTextItem';
import { CarouselPagination } from '../carousel/Pagination';

interface Autoplay {
  autoplayDelay: string;
  autoplayInterval: string;
}
import { CardProps } from '../types';
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
  headerStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  additionalStyle?: StyleProp<TextStyle>;
  cardContainerStyle?: ViewStyle;
  pageCounterStyle?: StyleProp<ViewStyle>;
  pageNumberStyle?: StyleProp<TextStyle>;
  pagination?: any;
  autoplay?: Autoplay;
  loop?: boolean;
}

export interface ImageCarouselBlockState {
  width?: number;
  height?: number;
  sliderActiveSlide: number;
  overallHeight: number;
}
// extends CardProps
export default class ImageCarouselBlock extends Component<
  ImageCarouselBlockProps,
  ImageCarouselBlockState
> {
  // readonly state: ImageCarouselBlockState = {};
  _slider1Ref: any | null = null;
  constructor(props: ImageCarouselBlockProps) {
    super(props);
    this.state = {
      sliderActiveSlide: SLIDER_1_FIRST_ITEM,
      overallHeight: 0,
    };
  }
  shouldComponentUpdate(
    nextProps: ImageCarouselBlockProps,
    nextState: ImageCarouselBlockState
  ): boolean {
    return (
      this.props.containerStyle !== nextProps.containerStyle ||
      this.props.items !== nextProps.items ||
      this.props.ratio !== nextProps.ratio ||
      this.props.options !== nextProps.options ||
      this.props.resizeMode !== nextProps.resizeMode ||
      this.props.source !== nextProps.source ||
      this.props.headerStyle !== nextProps.headerStyle ||
      this.props.textStyle !== nextProps.textStyle ||
      this.props.additionalStyle !== nextProps.additionalStyle ||
      this.state.sliderActiveSlide !== nextState.sliderActiveSlide ||
      this.state.overallHeight !== nextState.overallHeight
    );
  }

  _renderItem(data: any): JSX.Element {
    const { headerStyle, textStyle, additionalStyle, options } = this.props;
    const renderItemWidth = this.calculateItemWidth();
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
        additionalStyle={additionalStyle}
        even={false}
      />
    );
  }

  parentCardStyles(): number {
    const { cardContainerStyle } = this.props;

    if (!cardContainerStyle) {
      return 0;
    }
    const ml = +(cardContainerStyle.marginLeft || 0);
    const mr = +(cardContainerStyle.marginRight || 0);
    const pr = +(cardContainerStyle.paddingRight || 0);
    const pl = +(cardContainerStyle.paddingLeft || 0);
    return ml + mr + pr + pl;
  }

  horizontalMarginPadding(): number {
    const { containerStyle } = this.props;
    const ml = containerStyle.marginLeft || 0;
    const mr = containerStyle.marginRight || 0;
    const pr = containerStyle.paddingRight || 0;
    const pl = containerStyle.paddingLeft || 0;
    return ml + mr + pr + pl;
  }
  calculateSliderWidth(): number {
    return sliderWidth - this.horizontalMarginPadding() - this.parentCardStyles();
  }
  calculateItemWidth(): number {
    const { options } = this.props;

    const slideWidth = Math.round((this.calculateSliderWidth() * options.itemWidthPercent) / 100);
    return slideWidth + options.itemHorizontalPaddingPercent;
  }

  _onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height - this.state.overallHeight >= 1) {
      this.setState({
        overallHeight: height,
      });
    }
  };

  onSnapToItem = (index: number): void => {
    this.setState({
      sliderActiveSlide: index + 1,
    });
  };

  createCarousel(): JSX.Element {
    const { items, options, autoplay, loop } = this.props;

    const autoplayProps = autoplay
      ? {
          autoplay: true,
          autoplayDelay: parseFloat(autoplay.autoplayDelay) * 1000,
          autoplayInterval: parseFloat(autoplay.autoplayInterval) * 1000,
          lockScrollWhileSnapping: true,
        }
      : {};
    const enableMomentum = !autoplay;

    const loopProps = loop
      ? {
          loop: true,
          loopClonesPerSide: 3,
        }
      : {};

    const renderItemWidth = this.calculateItemWidth();
    return (
      <View onLayout={this._onLayout}>
        <Carousel
          data={items}
          renderItem={this._renderItem.bind(this)}
          hasParallaxImages={false}
          sliderWidth={this.calculateSliderWidth()}
          itemWidth={renderItemWidth}
          inactiveSlideScale={options.inactiveSlideScale}
          inactiveSlideOpacity={options.inactiveSlideOpacity}
          enableMomentum={enableMomentum}
          activeSlideAlignment={options.activeSlideAlignment}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          activeAnimationType={'spring'}
          onSnapToItem={this.onSnapToItem}
          {...autoplayProps}
          {...loopProps}
        />
      </View>
    );
  }
  render(): JSX.Element {
    const { containerStyle, items, pagination, pageCounter, pageCounterStyle, pageNumberStyle } =
      this.props;

    const carousel = this.createCarousel();

    return (
      <View style={containerStyle}>
        {carousel}
        {pageCounter && (
          <View style={[styles.pageCounter, pageCounterStyle]}>
            <Text style={[styles.pageNum, pageNumberStyle]}>
              {this.state.sliderActiveSlide} / {items.length}
            </Text>
          </View>
        )}
        {!!pagination && (
          <CarouselPagination
            activeIndex={this.state.sliderActiveSlide}
            pagination={pagination}
            containerStyle={containerStyle}
            items={items}
          />
        )}
      </View>
    );
  }
}
