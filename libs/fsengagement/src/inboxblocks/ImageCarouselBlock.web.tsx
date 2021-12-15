/* eslint-disable */
import React, { Component } from 'react';
import {
  Dimensions,
  ImageStyle,
  ImageURISource,
  StyleProp,
  Text,
  TextStyle,
  View,
  StyleSheet,
  ViewStyle
} from 'react-native';
import styles from '../carousel/index.style';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

const style = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200
  }
});

const { width: viewportWidth } = Dimensions.get('window');
const SLIDER_1_FIRST_ITEM = 1;
const sliderWidth = viewportWidth;
import RenderWebCarouselItem from '../carousel/RenderWebCarouselItem';

interface Autoplay {
  autoplayDelay: string;
  autoplayInterval: string;
}
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
  shouldComponentUpdate(
    nextProps: ImageCarouselBlockProps, nextState: ImageCarouselBlockState
  ): boolean {
    return this.props.containerStyle !== nextProps.containerStyle ||
      this.props.items !== nextProps.items ||
      this.props.ratio !== nextProps.ratio ||
      this.props.options !== nextProps.options ||
      this.props.resizeMode !== nextProps.resizeMode ||
      this.props.source !== nextProps.source ||
      this.props.headerStyle !== nextProps.headerStyle ||
      this.props.textStyle !== nextProps.textStyle ||
      this.props.additionalStyle !== nextProps.additionalStyle ||
      this.state.sliderActiveSlide !== nextState.sliderActiveSlide ||
      this.state.overallHeight !== nextState.overallHeight;
  }

  _renderItem(data: any, index: number): JSX.Element {
    const {
      headerStyle,
      textStyle,
      additionalStyle,
      options
    } = this.props;
    const renderItemWidth = this.calculateItemWidth();
    return (
      <Slide key={index} index={index}>
        <RenderWebCarouselItem
            data={data}
            itemWidth={renderItemWidth}
            horizPadding={options.itemHorizontalPaddingPercent}
            options={options}
            headerStyle={headerStyle}
            textStyle={textStyle}
            additionalStyle={additionalStyle}
          />
      </Slide>
    );
  }

  parentCardStyles(): number {
    const {
      cardContainerStyle
    } = this.props;

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
    const {
      containerStyle
    } = this.props;
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
    const {
      options
    } = this.props;

    const slideWidth = Math.round((this.calculateSliderWidth() * options.itemWidthPercent) / 100);
    return slideWidth + options.itemHorizontalPaddingPercent;
  }

  createCarousel(): JSX.Element {
    const {
     items,
     options = {},
     autoplay,
     loop
    } = this.props;

    const { itemWidthPercent = 0 } = options;
    const autoplayProps = autoplay ? {
      isPlaying: true,
      interval: parseFloat(autoplay.autoplayInterval) * 1000
    } : {};

    const loopProps = loop ? {
      infinite: true
    } : {};

    // const renderItemWidth = this.calculateItemWidth();
   return (
    <View style={style.container}>
      <CarouselProvider
        naturalSlideWidth={1}
        naturalSlideHeight={1}
        isIntrinsicHeight={true}
        totalSlides={items.length}
        visibleSlides={1}
        {...autoplayProps}
        {...loopProps}
      >
        <Slider style={{ paddingRight: (100 - itemWidthPercent)+ '%' }}>
          {(items || []).map((item: any, index: number) => {
            return this._renderItem(item, index);
          })}
        </Slider>
      </CarouselProvider>
    </View>

   )
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
        {pageCounter && (
          <View style={[styles.pageCounter, pageCounterStyle]}>
            <Text
              style={[styles.pageNum, pageNumberStyle]}
            >
              {this.state.sliderActiveSlide} / {items.length}
            </Text>
          </View>
        )}
      </View>
    );
  }
}
