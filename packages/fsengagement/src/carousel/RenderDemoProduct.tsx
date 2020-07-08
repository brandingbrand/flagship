/* tslint:disable */
import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './SliderEntry.style';
import { OptionsModalPresentationStyle } from 'react-native-navigation';

export interface RenderDemoProductProps {
  data?: any;
  index?: number;
  parallax?: any;
  parallaxProps?: any;
  even?: boolean;
  navigator: any;
  onPressOpenModal?: boolean;
  products?: any[];
  isDemoProduct?: boolean;
  horizPadding: number;
  itemWidth: number;
}
const stars = require('../../assets/images/stars.png');

export default class RenderDemoProduct extends Component<RenderDemoProductProps> {

  get image(): any {
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
        passProps: {
          products: this.props.products,
          index: this.props.index
        },
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
          modalPresentationStyle: OptionsModalPresentationStyle.overCurrentContext,
          bottomTabs: {
            visible: false
          }
        }
      }
    });
  }
  render() {
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
