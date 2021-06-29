import React, { Component } from 'react';
import {
  Dimensions,
  View,
  ViewStyle
} from 'react-native';
import { Navigator } from '@brandingbrand/fsapp';
import styles from '../carousel/index.style';
import Carousel, { CarouselProperties } from 'react-native-snap-carousel';

const { width: viewportWidth } = Dimensions.get('window');
const SLIDER_1_FIRST_ITEM = 1;
const sliderWidth = viewportWidth;
let renderItemOptions: any = {};
let renderItemWidth: number = 0;
import { wp } from '../carousel/SliderEntry.style';
import RenderDemoProduct, { RenderDemoProductData } from '../carousel/RenderDemoProduct';

interface CarouselOptions extends Pick<CarouselProperties<any>,
  'inactiveSlideScale' |
  'inactiveSlideOpacity' |
  'activeSlideAlignment'
> {
  itemWidthPercent: number;
  itemHorizontalPaddingPercent: number;
}

interface NumberedHorizontalViewStyle extends ViewStyle {
  marginLeft?: number;
  marginRight?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

export interface DemoProductCarouselBlockProps {
  items: RenderDemoProductData[];
  options: CarouselOptions;
  containerStyle?: NumberedHorizontalViewStyle;
  navigator: Navigator;
}

export interface DemoProductCarouselBlockState {
  width?: number;
  height?: number;
  sliderActiveSlide: number;
}
// extends CardProps
export default class DemoProductCarouselBlock
  extends Component<DemoProductCarouselBlockProps, DemoProductCarouselBlockState> {
  // readonly state: ImageCarouselBlockState = {};
  _slider1Ref: any | null = null;
  constructor(props: DemoProductCarouselBlockProps) {
    super(props);
    this.state = {
      sliderActiveSlide: SLIDER_1_FIRST_ITEM
    };
  }

  _renderItem = (data: {
    item: RenderDemoProductData;
    index: number;
  }): JSX.Element => {
    return (
      <RenderDemoProduct
        data={data.item}
        index={data.index}
        navigator={this.props.navigator}
        horizPadding={wp(renderItemOptions.itemHorizontalPaddingPercent)}
        itemWidth={renderItemWidth}
        onPressOpenModal={true}
        isDemoProduct={true}
        products={this.props.items}
        even={false}
      />
    );
  }

  horizontalMarginPadding(): number {
    const {
      containerStyle
    } = this.props;
    if (containerStyle) {
      const ml = containerStyle.marginLeft || 0;
      const mr = containerStyle.marginRight || 0;
      const pr = containerStyle.paddingRight || 0;
      const pl = containerStyle.paddingLeft || 0;
      return ml + mr + pr + pl;
    }
    return 0;
  }
  calculateSliderWidth(): number {
    return sliderWidth - this.horizontalMarginPadding();
  }
  calculateItemWidth(): number {
    const {
      options
    } = this.props;
    const slideWidth = wp(options.itemWidthPercent);
    const itemHorizontalMargin = wp(options.itemHorizontalPaddingPercent);
    return slideWidth + itemHorizontalMargin * 2 - this.horizontalMarginPadding();
  }

  onSnapToItem = (index: number) => this.setState({ sliderActiveSlide: index + 1 });

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
        onSnapToItem={this.onSnapToItem}
      />
    );
  }
  render(): JSX.Element {
    const {
      containerStyle
    } = this.props;
    const carousel = this.createCarousel();

    return (
      <View style={containerStyle}>
        {carousel}
      </View>
    );
  }
}
