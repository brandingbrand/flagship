import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import FSI18n from '@brandingbrand/fsi18n';
import { ProductItemProps } from '../ProductItemProps';

const style = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10
  },
  price: {
    fontSize: 16
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999'
  },
  salePrice: {
    color: '#F00',
    fontSize: 16,
    marginLeft: 5
  }
});

export type ProductItemPriceProps = Pick<
  ProductItemProps,
  'price' | 'originalPrice' | 'priceStyle' | 'originalPriceStyle' | 'salePriceStyle' | 'renderPrice'
>;

export class ProductItemPrice extends Component<ProductItemPriceProps> {
  render(): React.ReactNode {
    const {
      price,
      originalPrice,
      priceStyle,
      originalPriceStyle,
      salePriceStyle,
      renderPrice
    } = this.props;

    if (renderPrice) {
      return renderPrice();
    }

    if (!price) {
      return null;
    }

    if (originalPrice && originalPrice !== price) {
      return (
        <View style={[style.priceContainer]}>
          <Text style={[style.originalPrice, originalPriceStyle]}>
            {FSI18n.currency(originalPrice)}
          </Text>
          <Text style={[style.salePrice, salePriceStyle]}>
            {FSI18n.currency(price)}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={[style.priceContainer]}>
          <Text style={[style.price, priceStyle]}>
            {FSI18n.currency(price)}
          </Text>
        </View>
      );
    }
  }
}
