/* tslint:disable */
import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './SliderEntry.style';
import { Navigator } from '@brandingbrand/fsapp';
import { noop } from 'lodash-es';
import { OptionsModalPresentationStyle } from 'react-native-navigation';
import { DataProps } from '../types';

export interface RenderDemoProductProps<D> {
  data?: D & DataProps;
  index?: number;
  parallax?: any;
  parallaxProps?: any;
  even?: boolean;
  navigator: Navigator;
  onPressOpenModal?: boolean;
  products?: any[];
  isDemoProduct?: boolean;
  horizPadding: number;
  itemWidth: number;
}

const stars = require('../../assets/images/stars.png');

export default class RenderDemoProduct<T> extends Component<RenderDemoProductProps<T>> {

  get image() {
    const { data } = this.props;

    if (!data?.image) {
      return null;
    }

    return (
        <Image
          source={data.image.source}
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
          modalPresentationStyle: OptionsModalPresentationStyle.overCurrentContext,
          bottomTabs: {
            visible: false,
            translucent: true
          }
        },
        passProps: {
          products: this.props.products,
          index: this.props.index
        }
      }
    }).catch(noop);
  }
  render() {
    const { data, itemWidth, horizPadding } = this.props;
    if (!data) {
      return null;
    }

    const { ratio } = data.image;
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
        <View style={{
          height: PROD_IMG_HEIGHT,
          width: PROD_IMG_HEIGHT * ratio,
          alignSelf: 'center'
        }}>
          <View style={[styles.imageContainerNoCard]}>
            {this.image}
          </View>
        </View>
        <View style={[styles.productContainer]}>
          <Text
            style={styles.prodTitle}
            numberOfLines={2}
          >
            {data.title}
          </Text>
          <Image
            source={stars}
            style={styles.stars}
          />
          <Text
            style={styles.price}
          >
            {data.price}
          </Text>

        </View>
      </TouchableOpacity>
    );
  }
}
