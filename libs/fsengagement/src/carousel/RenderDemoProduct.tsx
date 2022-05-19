import React, { Component } from 'react';

import type { ImageURISource } from 'react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import type { Navigator } from '@brandingbrand/fsapp';

import { OptionsModalPresentationStyle } from 'react-native-navigation/lib/dist/interfaces/Options';

import stars from '../../assets/images/stars.png';

import styles from './SliderEntry.style';

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
  parallax?: unknown;
  parallaxProps?: unknown;
  even?: boolean;
  navigator: Navigator;
  onPressOpenModal?: boolean;
  products?: unknown[];
  isDemoProduct?: boolean;
  horizPadding: number;
  itemWidth?: number;
}

export default class RenderDemoProduct extends Component<RenderDemoProductProps> {
  private get image(): JSX.Element {
    const {
      data: { image },
    } = this.props;

    return <Image source={image.source} style={styles.image} />;
  }

  private readonly openCarouselModal = () => {
    if (!this.props.onPressOpenModal) {
      return;
    }
    this.props.navigator
      .showModal({
        component: {
          name: 'EngagementProductModal',
          options: {
            animations: {
              showModal: {
                enabled: false,
              },
            },
            topBar: {
              visible: false,
              drawBehind: true,
              background: {
                translucent: true,
              },
            },
            layout: {
              backgroundColor: 'transparent',
            },
            bottomTabs: {
              visible: false,
            },
            modalPresentationStyle: OptionsModalPresentationStyle.overCurrentContext,
          },
          passProps: {
            products: this.props.products,
            index: this.props.index,
          },
        },
      })
      .catch((error) => {
        console.error(error);
      });
  };

  public render(): JSX.Element {
    const {
      data: { image, price, title },
      horizPadding = 0,
      itemWidth,
    } = this.props;
    const { ratio } = image;
    const PROD_IMG_HEIGHT = 165;
    const PROD_ITEM_HEIGHT = 275;

    let itemStyle: any = {};
    itemStyle =
      ratio && itemWidth
        ? {
            width: itemWidth,
            height: PROD_ITEM_HEIGHT,
            paddingHorizontal: horizPadding,
          }
        : {
            width: itemWidth,
            height: PROD_ITEM_HEIGHT,
            paddingHorizontal: horizPadding,
          };

    return (
      <TouchableOpacity activeOpacity={1} style={itemStyle} onPress={this.openCarouselModal}>
        <View
          style={{
            height: PROD_IMG_HEIGHT,
            width: PROD_IMG_HEIGHT * ratio,
            alignSelf: 'center',
          }}
        >
          <View style={[styles.imageContainerNoCard]}>{this.image}</View>
        </View>
        <View style={[styles.productContainer]}>
          <Text style={styles.prodTitle} numberOfLines={2}>
            {title}
          </Text>
          <Image source={stars} style={styles.stars} />
          <Text style={styles.price}>{price}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
