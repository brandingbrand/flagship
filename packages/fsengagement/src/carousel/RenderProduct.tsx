/* tslint:disable */
import React, { Component } from 'react';
import {
  Dimensions, Image, Linking, Text, StyleProp, TextStyle, TouchableOpacity, View
} from 'react-native';
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
  get image(): any {
    const { data } = this.props;
    return (
      <Image
        source={{uri: data.image.url}}
        style={styles.image}
      />
    );
  }
  onProductPress = (): void => {
    const { data } = this.props;
    if (!data.deepLinkUrl) {
      return;
    }
    const deeplink = data.deepLinkUrl + data.productId;
    Linking.canOpenURL(deeplink).then(supported => {
      if (!supported) {
        alert('An error occurred: can\'t handle url ' + deeplink);
        return false;
      } else {
        if (this.props.onBackPress) {
          this.props.onBackPress();
        }
        return Linking.openURL(deeplink);
      }
    }).catch(err => alert('An error occurred: ' + err));
  }
  render() {
    const {
      data: {
        name,
        price
      },
      even = false,
      itemWidth,
      horizPadding = 0,
      spaceBetweenHorizontal = 0,
      spaceBetweenVertical = 0
    } = this.props;

    const ratio = '.75';
    let itemStyle: any = {};
    if (ratio && itemWidth) {
      itemStyle = {
        width: even ? itemWidth - 1 : itemWidth,
        height: (itemWidth / parseFloat(ratio)) + 65,
        paddingHorizontal: horizPadding,
        marginLeft: even ? spaceBetweenHorizontal : 0,
        marginBottom: spaceBetweenVertical
      };
    } else {
      itemStyle = {
        width: itemWidth,
        height: viewportHeight * .36,
        paddingHorizontal: horizPadding
      };
    }
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={itemStyle}
        onPress={this.onProductPress}
      >
        <View style={styles.imageContainerNoCard}>
          {this.image}
        </View>
        {name && <View style={styles.textContainer}>
          <Text
            style={[styles.title, this.props.titleStyle]}
            numberOfLines={2}
          >
            {name}
          </Text>
          <Text
            style={[styles.subtitle, this.props.priceStyle]}
          >
            {price.formattedValue}
          </Text>
        </View>}
      </TouchableOpacity>
    );
  }
}
