import React, { Component } from 'react';

import type { ImageStyle, ImageURISource, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ActivityIndicator, Dimensions, View } from 'react-native';

import FSNetwork from '@brandingbrand/fsnetwork';

import RenderProduct from '../carousel/RenderProduct';
import { wp } from '../carousel/SliderEntry.style';
import styles from '../carousel/index.style';

const { width: viewportWidth } = Dimensions.get('window');
const SLIDER_1_FIRST_ITEM = 1;
const sliderWidth = viewportWidth;
let renderItemOptions: any = {};
let renderItemWidth = 0;
let onBackPress: () => void;

export interface GridWallBlockProps {
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
  animateIndex?: number;
  onBack?: () => void;
}

export interface GridWallBlockState {
  products: any[];
  sliderActiveSlide: number;
  loading: boolean;
}

export default class GridWallBlock extends Component<GridWallBlockProps, GridWallBlockState> {
  constructor(props: GridWallBlockProps) {
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

  public _slider1Ref: any | null = null;
  private readonly network: FSNetwork;

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

  private _renderItem(item: any, index: number): JSX.Element {
    return (
      <RenderProduct
        data={item}
        key={index}
        onBackPress={onBackPress}
        spaceBetweenHorizontal={renderItemOptions.spaceBetweenHorizontal}
        spaceBetweenVertical={renderItemOptions.spaceBetweenVertical}
        itemWidth={renderItemWidth}
        even={(index + 1) % 2 === 0}
      />
    );
  }

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
    const slideWidth = wp(50);
    return slideWidth - options.spaceBetweenHorizontal / 2 - this.horizontalMarginPadding() / 2;
  }

  private createGrid(): JSX.Element {
    const { options } = this.props;
    renderItemOptions = options;
    renderItemWidth = this.calculateItemWidth();
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {(this.state.products || []).map((product: any, index: number) =>
          this._renderItem(product, index)
        )}
      </View>
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
    const grid = this.createGrid();
    if (this.state.loading) {
      return (
        <View style={styles.loadingInner}>
          <ActivityIndicator color="rgba(0,0,0,0.5)" />
        </View>
      );
    }
    return <View style={containerStyle}>{grid}</View>;
  }
}
