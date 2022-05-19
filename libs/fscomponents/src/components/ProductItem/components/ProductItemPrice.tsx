import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';

import { types, weights } from '../../../styles/variables';
import { Price } from '../../Price';
import type { ProductItemProps } from '../ProductItem';

const style = StyleSheet.create({
  originalPrice: {
    color: '#ccc',
    textDecorationLine: 'line-through',
  },
  priceContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginBottom: 7,
  },
  salePrice: {
    marginLeft: 7,
  },
});

export type ProductItemPriceProps = Pick<
  ProductItemProps,
  'originalPrice' | 'originalPriceStyle' | 'price' | 'priceStyle' | 'renderPrice' | 'salePriceStyle'
>;

export class ProductItemPrice extends Component<ProductItemPriceProps> {
  public render(): React.ReactNode {
    const { originalPrice, originalPriceStyle, price, priceStyle, renderPrice, salePriceStyle } =
      this.props;

    if (renderPrice) {
      return renderPrice();
    }

    const flattenedOriginalPriceStyle = StyleSheet.flatten([
      types.small,
      weights.regular,
      style.originalPrice,
      originalPriceStyle,
    ]);

    const flattenedPriceStyle = StyleSheet.flatten([types.small, weights.medium, priceStyle]);

    const flattenedSalePriceStyle = StyleSheet.flatten([
      types.small,
      weights.medium,
      style.salePrice,
      salePriceStyle,
    ]);

    return (
      <View style={style.priceContainer}>
        <Price
          originalPrice={originalPrice}
          originalPriceFirst
          originalPriceStyle={flattenedOriginalPriceStyle}
          price={price}
          priceStyle={flattenedPriceStyle}
          salePriceStyle={flattenedSalePriceStyle}
        />
      </View>
    );
  }
}
