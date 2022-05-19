import React, { Component } from 'react';

import type { StyleProp, TextStyle } from 'react-native';
import { Dimensions, Image, Linking, Text, TouchableOpacity, View } from 'react-native';

import styles from './SliderEntry.style';

export interface RenderProductProps {
  data?: any;
  horizPadding?: number;
  spaceBetweenHorizontal?: number;
  spaceBetweenVertical?: number;
  itemWidth: number;
  even?: boolean;
  priceStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onBackPress?: () => void;
}

const { height: viewportHeight } = Dimensions.get('window');

export default class RenderProduct extends Component<RenderProductProps> {
  private get image(): JSX.Element {
    const { data } = this.props;
    return <Image source={{ uri: data.image.url }} style={styles.image} />;
  }

  private readonly onProductPress = (): void => {
    const { data } = this.props;
    if (!data.deepLinkUrl) {
      return;
    }
    const deeplink = data.deepLinkUrl + data.productId;
    Linking.canOpenURL(deeplink)
      .then((supported) => {
        if (!supported) {
          alert(`An error occurred: can't handle url ${deeplink}`);
          return false;
        }
        if (this.props.onBackPress) {
          this.props.onBackPress();
        }
        return Linking.openURL(deeplink);
      })
      .catch((error) => {
        alert(`An error occurred: ${error}`);
      });
  };

  public render(): JSX.Element {
    const {
      data: { name, price },
      even = false,
      horizPadding = 0,
      itemWidth,
      spaceBetweenHorizontal = 0,
      spaceBetweenVertical = 0,
    } = this.props;

    const ratio = '.75';
    let itemStyle: any = {};
    itemStyle =
      ratio && itemWidth
        ? {
            width: even ? itemWidth - 1 : itemWidth,
            height: itemWidth / Number.parseFloat(ratio) + 65,
            paddingHorizontal: horizPadding,
            marginLeft: even ? spaceBetweenHorizontal : 0,
            marginBottom: spaceBetweenVertical,
          }
        : {
            width: itemWidth,
            height: viewportHeight * 0.36,
            paddingHorizontal: horizPadding,
          };
    return (
      <TouchableOpacity activeOpacity={1} style={itemStyle} onPress={this.onProductPress}>
        <View style={styles.imageContainerNoCard}>{this.image}</View>
        {name && (
          <View style={styles.textContainer}>
            <Text style={[styles.title, this.props.titleStyle]} numberOfLines={2}>
              {name}
            </Text>
            <Text style={[styles.subtitle, this.props.priceStyle]}>{price.formattedValue}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
