// tslint:disable
import React, { Component } from 'react';
import {
  Dimensions,
  ImageStyle,
  ImageURISource,
  StyleProp,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import styles from '../carousel/index.style';
import Carousel from 'react-native-snap-carousel';
import { Navigator } from '@brandingbrand/fsapp';
import { wp } from '../carousel/SliderEntry.style';
import RenderDemoProduct from '../carousel/RenderDemoProduct';
import {
  CardProps, DataProps, Sizes
} from '../types';

const { width: viewportWidth } = Dimensions.get('window');
const SLIDER_1_FIRST_ITEM = 1;
const sliderWidth = viewportWidth;
let renderItemOptions: any = {};
let renderItemWidth: number = 0;
let itemsArr: RenderItemType<DataProps>[] = [];

let navigator: Navigator;

interface RenderItemType<T> {
  item: T;
  index: number;
}

export interface DemoProductCarouselBlockProps extends CardProps {
  source: ImageURISource;
  resizeMode?: any;
  resizeMethod?: any;
  items: any;
  options: any;
  ratio?: string;
  useRatio?: boolean;
  pageCounter?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle> & Sizes;
  pageCounterStyle?: StyleProp<ViewStyle>;
  pageNumberStyle?: StyleProp<TextStyle>;
}

export interface DemoProductCarouselBlockState {
  width?: number;
  height?: number;
  sliderActiveSlide: number;
}
// extends CardProps
export default class DemoProductCarouselBlock<T>
  extends Component<DemoProductCarouselBlockProps, DemoProductCarouselBlockState> {
  // readonly state: ImageCarouselBlockState = {};
  // _slider1Ref: any | null = null;
  constructor(props: DemoProductCarouselBlockProps) {
    super(props);
    this.state = {
      sliderActiveSlide: SLIDER_1_FIRST_ITEM
    };
  }

  componentDidMount(): void {
    navigator = this.props.navigator;
  }
  _renderItem(data: RenderItemType<DataProps>): JSX.Element {
    return <RenderDemoProduct
      data={data.item}
      index={data.index}
      navigator={navigator}
      horizPadding={wp(renderItemOptions.itemHorizontalPaddingPercent)}
      itemWidth={renderItemWidth}
      onPressOpenModal={true}
      isDemoProduct={true}
      products={itemsArr}
      even={false}
    />;
  }

  horizontalMarginPadding() {
    const {
      containerStyle
    } = this.props;

    if (!containerStyle) {
      return 0;
    }

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
      items
    } = this.props;
    itemsArr = [...items];
    const carousel = this.createCarousel();

    return (
      <View style={containerStyle}>
        {carousel}
      </View>
    );
  }
}
