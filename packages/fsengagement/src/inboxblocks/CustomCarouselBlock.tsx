// tslint:disable
import React, { Component } from 'react';
import {
  Dimensions,
  ImageStyle,
  ImageURISource,
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import styles from '../carousel/index.style';
import Carousel from 'react-native-snap-carousel';

import {
  BlockItem,
  ComponentList
} from '../types';
import { CarouselPagination } from '../carousel/Pagination';

import ImageWithOverlay from './ImageWithOverlay';
import { TextBlock } from './TextBlock';
import TextBanner from './TextBanner';
import { ImageBlock } from './ImageBlock';
import IconText from './IconTextBlock';
import ImageWithTextBlock from './ImageWithTextBlock';

const components: ComponentList = {
  Text: TextBlock,
  IconText,
  ImageWithOverlay,
  TextBanner,
  ImageWithText: ImageWithTextBlock,
  Image: ImageBlock
};

const { width: viewportWidth } = Dimensions.get('window');
const SLIDER_1_FIRST_ITEM = 1;
const sliderWidth = viewportWidth;

interface Autoplay {
  autoplayDelay: string;
  autoplayInterval: string;
}

import {
  CardProps
} from '../types';
export interface CustomCarouselBlockProps extends CardProps {
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
export default class CustomCarouselBlock
  extends Component<CustomCarouselBlockProps, ImageCarouselBlockState> {
  // readonly state: ImageCarouselBlockState = {};
  _slider1Ref: any | null = null;
  constructor(props: CustomCarouselBlockProps) {
    super(props);
    this.state = {
      sliderActiveSlide: SLIDER_1_FIRST_ITEM,
      overallHeight: 0
    };
  }

  shouldComponentUpdate(nextProps: CustomCarouselBlockProps, nextState: ImageCarouselBlockState): boolean {
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
  renderBlock = (item: BlockItem): React.ReactElement | null => {
    const {
      private_blocks,
      private_type,
      ...restProps } = item;
    const {id, name, options } = this.props;
    const renderItemWidth = this.calculateItemWidth()
    const props = {
      id,
      name,
      parentWidth: renderItemWidth,
      outerContainerStyle: {
        paddingRight: options.itemHorizontalPaddingPercent || 0
      },
      ...restProps
    };

    if (!components?.[private_type]) {
      return null;
    }
    return React.createElement(
      components[private_type],
      {
        ...props,
        navigator: this.props.navigator
      },
      private_blocks && private_blocks.map(this.renderBlock)
    );
  }
  dataKeyExtractor = (item: BlockItem): string => {
    return item.id || item.key || Math.floor(Math.random() * 1000000).toString();
  }
  _renderItem(data: any): JSX.Element {
    const {
      options
    } = this.props;
    const renderItemWidth = this.calculateItemWidth();
    return (
      <View
        key={this.dataKeyExtractor(data.index)}
        style={{
          width: renderItemWidth,
          paddingRight: options.itemHorizontalPaddingPercent
        }}
      >
        {this.renderBlock(data.item)}
      </View>
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
  }
  _onLayout = (event: LayoutChangeEvent) => {
    var { height } = event.nativeEvent.layout;
    if (height - this.state.overallHeight >= 1) {
      this.setState({
        overallHeight: height
      });
    }
  }

  onSnapToItem = (index: number): void => {
    this.setState({
      sliderActiveSlide: index + 1
    });
  }

  createCarousel(): JSX.Element {
    const {
      items,
      options,
      autoplay,
      loop
    } = this.props;

    const autoplayProps = autoplay ? {
      autoplay: true,
      autoplayDelay: parseFloat(autoplay.autoplayDelay) * 1000,
      autoplayInterval: parseFloat(autoplay.autoplayInterval) * 1000,
      lockScrollWhileSnapping: true
    } : {};
    const enableMomentum = !autoplay;
    const loopProps = loop ? {
      loop: true,
      loopClonesPerSide: 3
    } : {};
    let renderItemWidth = this.calculateItemWidth();
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
    const {
      containerStyle,
      pagination,
      items
    } = this.props;

    const carousel = this.createCarousel();
    return (
      <View style={containerStyle}>
        {carousel}
        {pagination && (
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
