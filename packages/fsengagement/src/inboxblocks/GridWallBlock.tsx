// tslint:disable
import React, { Component } from 'react';
import FSNetwork from '@brandingbrand/fsnetwork';
import {
  ActivityIndicator,
  Dimensions,
  ImageStyle,
  ImageURISource,
  StyleProp,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import styles from '../carousel/index.style';

const { width: viewportWidth } = Dimensions.get('window');
const SLIDER_1_FIRST_ITEM = 1;
const sliderWidth = viewportWidth;
let renderItemOptions: any = {};
let renderItemWidth: number = 0;
let onBackPress: () => void;
import { wp } from '../carousel/SliderEntry.style';
import RenderProduct from '../carousel/RenderProduct';

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

export default class GridWallBlock
  extends Component<GridWallBlockProps, GridWallBlockState> {

  private network: FSNetwork;
  _slider1Ref: any | null = null;
  constructor(props: GridWallBlockProps) {
    super(props);
    this.state = {
      sliderActiveSlide: SLIDER_1_FIRST_ITEM,
      products: [],
      loading: true
    };
    this.network = new FSNetwork({
      baseURL: props.baseUrl
    });
  }

  async componentDidMount(): Promise<void> {
    const { items } = this.props;
    const products = await this.fetchProducts(items);
    this.setState({
      products: products.filter((item: any) => !item.error),
      loading: false
    });
   }

  async fetchProduct(id: string): Promise<any> {
    let imageFormat = this.props.imageFormat || 'Regular_Mobile';
    return this.network.get(id)
      .then((r: any) => r.data)
      .then((item: any) => {
        return {
          name: item.name,
          price: item.price,
          url: item.url,
          productId: id,
          deepLinkUrl: this.props.deepLinkUrl,
          image: (item.galleryImageList.galleryImage || []).find((img: any) => {
            return img.format === imageFormat;
          })
        };
      })
      .catch(async (e: any) => {
        return Promise.resolve({
          error: e
        });
      });
  }

  async fetchProducts(items: any[]): Promise<any> {
    const promises = items.map(async item => {
      return this.fetchProduct(item.productId);
    });
    return await Promise.all(promises);
  }

  _renderItem(item: any, index: number): JSX.Element {
    return (
        <RenderProduct
            data={item}
            key={index}
            onBackPress={onBackPress}
            spaceBetweenHorizontal={renderItemOptions.spaceBetweenHorizontal}
            spaceBetweenVertical={renderItemOptions.spaceBetweenVertical}
            itemWidth={renderItemWidth}
            even={(index + 1) % 2 === 0}
    />);
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
    const slideWidth = wp(50);
    return slideWidth - (options.spaceBetweenHorizontal / 2) - (this.horizontalMarginPadding()/2);
  }
  createGrid(): JSX.Element {
    const {
      options
    } = this.props;
    renderItemOptions = options;
    renderItemWidth = this.calculateItemWidth();
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}>
        {(this.state.products || []).map((product: any, index: number) => {
          return this._renderItem(product, index);
        })}
      </View>
    );
  }
  render(): JSX.Element {
    const {
      containerStyle
    } = this.props;
    if (this.props.onBack) {
      onBackPress = this.props.onBack;
    }
    const grid = this.createGrid();
    if (this.state.loading) {
      return (
        <View style={styles.loadingInner}>
          <ActivityIndicator color='rgba(0,0,0,0.5)' />
        </View>
      );
    }
    return (
      <View style={containerStyle}>
        {grid}
      </View>
    );
  }
}
