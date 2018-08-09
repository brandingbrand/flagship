import React, { Component } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import PSProductCarousel from './PSProductCarousel';
import { border, palette } from '../styles/variables';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import translate, { translationKeys } from '../lib/translations';

type Navigator = import ('react-native-navigation').Navigator;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: border.color,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column'
  },
  recentTitle: {
    color: palette.onBackground,
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 15
  },
  recentProductsCarousel: {
    marginVertical: 20
  }
});

export interface PSRecentlyViewedCarouselProps {
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  carouselStyle?: StyleProp<ViewStyle>;
  items: CommerceTypes.Product[];
  navigator: Navigator;
}

export default class PSRecentlyViewedCarousel extends Component<PSRecentlyViewedCarouselProps> {
  constructor(props: PSRecentlyViewedCarouselProps) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Text style={[styles.recentTitle, this.props.titleStyle]}>
          {translate.string(translationKeys.screens.productDetail.recentlyViewed)}
        </Text>
        <PSProductCarousel
          style={[styles.recentProductsCarousel, this.props.carouselStyle]}
          items={this.props.items.map(prod => ({
            ...prod,
            image: (prod.images || []).find(img => !!img.uri),
            onPress: this.handlePromotedProductPress(prod.id),
            key: prod.id
          }))}
        />
      </View>
    );
  }

  handlePromotedProductPress = (productId: string) => () => {
    this.props.navigator.push({
      screen: 'ProductDetail',
      passProps: {
        productId
      }
    });
  }
}
