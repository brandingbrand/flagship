import React, { Component } from 'react';
import { Image, ImageURISource, Text, TouchableOpacity, View } from 'react-native';
import styles from './SliderEntry.style';
import { Navigator } from '@brandingbrand/fsapp';
import {
  OptionsModalPresentationStyle
} from 'react-native-navigation/lib/dist/interfaces/Options';

export interface RenderDemoProductData {
  image: {
    ratio: number;
    source: ImageURISource;
  };
  price: string;
  title: string;
}

export interface RenderDemoProductProps {
  data: RenderDemoProductData;
  index?: number;
  parallax?: any;
  parallaxProps?: any;
  even?: boolean;
  navigator: Navigator;
  onPressOpenModal?: boolean;
  products?: any[];
  isDemoProduct?: boolean;
  horizPadding: number;
  itemWidth?: number;
}
const stars = require('../../assets/images/stars.png');

export default class RenderDemoProduct extends Component<RenderDemoProductProps> {

  get image(): JSX.Element {
    const { data: { image } } = this.props;

    return (
      <Image
        source={image.source}
        style={styles.image}
      />
    );
  }
  openCarouselModal = () => {
    if (!this.props.onPressOpenModal) {
      return;
    }
    this.props.navigator.showModal({
      component: {
        name: 'EngagementProductModal',
        options: {
          animations: {
            showModal: {
              enabled: false
            }
          },
          topBar: {
            visible: false,
            drawBehind: true,
            background: {
              translucent: true
            }
          },
          layout: {
            backgroundColor: 'transparent'
          },
          bottomTabs: {
            visible: false
          },
          modalPresentationStyle: OptionsModalPresentationStyle.overCurrentContext
        },
        passProps: {
          products: this.props.products,
          index: this.props.index
        }
      }
    }).catch(e => console.error(e));
  }
  render(): JSX.Element {
    const {
      data: {
        title,
        image,
        price
      },
      itemWidth,
      horizPadding = 0
    } = this.props;
    const { ratio } = image;
    const PROD_IMG_HEIGHT = 165;
    const PROD_ITEM_HEIGHT = 275;

    let itemStyle: any = {};
    if (ratio && itemWidth) {
      itemStyle = {
        width: itemWidth,
        height: PROD_ITEM_HEIGHT,
        paddingHorizontal: horizPadding
      };
    } else {
      itemStyle = {
        width: itemWidth,
        height: PROD_ITEM_HEIGHT,
        paddingHorizontal: horizPadding
      };
    }

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={itemStyle}
        onPress={this.openCarouselModal}
      >
        <View
          style={{
            height: PROD_IMG_HEIGHT,
            width: PROD_IMG_HEIGHT * ratio,
            alignSelf: 'center'
          }}
        >
          <View style={[styles.imageContainerNoCard]}>
            {this.image}
          </View>
        </View>
        <View style={[styles.productContainer]}>
          <Text
            style={styles.prodTitle}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Image
            source={stars}
            style={styles.stars}
          />
          <Text
            style={styles.price}
          >
            {price}
          </Text>

        </View>
      </TouchableOpacity>
    );
  }
}
