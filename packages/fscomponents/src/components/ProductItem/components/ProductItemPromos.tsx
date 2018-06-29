import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { ProductItemProps } from '../ProductItemProps';

const style = StyleSheet.create({
  promo: {
    color: '#F00'
  }
});

export type ProductItemPromosProps = Pick<
  ProductItemProps,
  'promotions' | 'promoStyle' | 'promoContainerStyle' | 'renderPromos' | 'promos'
>;

export class ProductItemPromos extends Component<ProductItemPromosProps> {
  render(): React.ReactNode {
    const {
      promotions,
      promoStyle,
      promoContainerStyle,
      renderPromos,
      promos // deprecated
    } = this.props;
    const promosList = promotions || promos;

    if (renderPromos) {
      return renderPromos();
    }

    if (!promosList || !promosList.length) {
      return null;
    }

    return (
      <View style={promoContainerStyle}>
        {promosList.map((p, i) => (
          <Text key={i} style={[style.promo, promoStyle]}>
            {p}
          </Text>
        ))}
      </View>
    );
  }
}
