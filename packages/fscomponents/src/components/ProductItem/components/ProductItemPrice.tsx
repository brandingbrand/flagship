import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { ProductItemProps } from '../ProductItem';
import { types, weights } from '../../../styles/variables';
import { Price } from '../../Price';

const style = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 7
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#ccc'
  },
  salePrice: {
    marginLeft: 7
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

    const flattenedOriginalPriceStyle = StyleSheet.flatten([
      types.small,
      weights.regular,
      style.originalPrice,
      originalPriceStyle
    ]);

    const flattenedPriceStyle = StyleSheet.flatten([
      types.small,
      weights.medium,
      priceStyle
    ]);

    const flattenedSalePriceStyle = StyleSheet.flatten([
      types.small,
      weights.medium,
      style.salePrice,
      salePriceStyle
    ]);

    return (
      <View style={[style.priceContainer]}>
        <Price
          originalPriceFirst={true}
          originalPrice={originalPrice}
          price={price}
          originalPriceStyle={flattenedOriginalPriceStyle}
          priceStyle={flattenedPriceStyle}
          salePriceStyle={flattenedSalePriceStyle}
        />
      </View>
    );
  }
}
