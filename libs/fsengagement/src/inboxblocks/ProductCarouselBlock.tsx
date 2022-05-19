import React, { Component } from 'react';

import type { ImageStyle, ImageURISource, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import FSNetwork from '@brandingbrand/fsnetwork';

import RenderProduct from '../carousel/RenderProduct';
import { wp } from '../carousel/SliderEntry.style';
import styles from '../carousel/index.style';

const { width: viewportWidth } = Dimensions.get('window');
const SLIDER_1_FIRST_ITEM = 1;
const sliderWidth = viewportWidth;
let renderItemOptions: any = {};
let renderItemWidth = 0;
let renderItemTitleStyle: StyleProp<TextStyle> = {};
let renderItemPriceStyle: StyleProp<TextStyle> = {};
let onBackPress: () => void;

export interface ProductCarouselBlockProps {
  source: ImageURISource;
  resizeMode?: any;
  resizeMethod?: any;
  items: any;
  options: any;
  ratio?: string;
  useRatio?: boolean;
  imageFormat?: string;
  baseUrl: string;
  deepLinkUrl?: string;
  pageCounter?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: any;
  pageCounterStyle?: StyleProp<ViewStyle>;
  pageNumberStyle?: StyleProp<TextStyle>;
  priceStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  animateIndex?: number;
  onBack?: () => void;
}

export interface ProductCarouselBlockState {
  products: any[];
  sliderActiveSlide: number;
  loading: boolean;
}

export default class ProductCarouselBlock extends Component<
  ProductCarouselBlockProps,
  ProductCarouselBlockState
> {
  constructor(props: ProductCarouselBlockProps) {
    super(props);
    this.state = {
      sliderActiveSlide: SLIDER_1_FIRST_ITEM,
      products: [],
      loading: true,
    };
    this.network = new FSNetwork({
      baseURL: props.baseUrl,
    });
  }

  private readonly network: FSNetwork;
  public _slider1Ref: any | null = null;

  private async fetchProduct(id: string): Promise<any> {
    const imageFormat = this.props.imageFormat || 'Regular_Mobile';
    return this.network
      .get(id)
      .then((r: any) => r.data)
      .then((item: any) => ({
        name: item.name,
        price: item.price,
        url: item.url,
        productId: id,
        deepLinkUrl: this.props.deepLinkUrl,
        image: (item.galleryImageList.galleryImage || []).find(
          (img: any) => img.format === imageFormat
        ),
      }))
      .catch(async (error: any) => ({
        error,
      }));
  }

  private async fetchProducts(items: any[]): Promise<any> {
    const promises = items.map(async (item) => this.fetchProduct(item.productId));
    return Promise.all(promises);
  }

  private readonly _renderItem = (data: any): JSX.Element => (
    <RenderProduct
      data={data.item}
      horizPadding={wp(renderItemOptions.itemHorizontalPaddingPercent)}
      itemWidth={renderItemWidth}
      onBackPress={onBackPress}
      titleStyle={renderItemTitleStyle}
      priceStyle={renderItemPriceStyle}
    />
  );

  private horizontalMarginPadding(): number {
    const { containerStyle } = this.props;
    const ml = containerStyle.marginLeft || 0;
    const mr = containerStyle.marginRight || 0;
    const pr = containerStyle.paddingRight || 0;
    const pl = containerStyle.paddingLeft || 0;
    return ml + mr + pr + pl;
  }

  private calculateSliderWidth(): number {
    return sliderWidth - this.horizontalMarginPadding();
  }

  private calculateItemWidth(): number {
    const { options } = this.props;
    const slideWidth = wp(options.itemWidthPercent);
    const itemHorizontalMargin = wp(options.itemHorizontalPaddingPercent);
    return slideWidth + itemHorizontalMargin * 2 - this.horizontalMarginPadding();
  }

  private readonly onSnapToItem = (index: number) => {
    this.setState({ sliderActiveSlide: index + 1 });
  };

  private createCarousel(): JSX.Element {
    const { options, priceStyle, titleStyle } = this.props;
    renderItemTitleStyle = titleStyle;
    renderItemPriceStyle = priceStyle;
    renderItemOptions = options;
    renderItemWidth = this.calculateItemWidth();
    return (
      <Carousel
        data={this.state.products}
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

  public async componentDidMount(): Promise<void> {
    const { items } = this.props;
    const products = await this.fetchProducts(items);
    this.setState({
      products: products.filter((item: any) => !item.error),
      loading: false,
    });
  }

  public render(): JSX.Element {
    const { containerStyle } = this.props;
    if (this.props.onBack) {
      onBackPress = this.props.onBack;
    }
    const carousel = this.createCarousel();

    return (
      <View style={containerStyle}>
        {this.state.loading && (
          <View style={styles.loadingInner}>
            <ActivityIndicator color="rgba(0,0,0,0.5)" />
          </View>
        )}
        {carousel}
      </View>
    );
  }
}
