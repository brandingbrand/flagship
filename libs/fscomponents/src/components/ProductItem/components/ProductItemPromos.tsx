import React, { Component } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { types, weights } from '../../../styles/variables';
import type { ProductItemProps } from '../ProductItem';

const style = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  promo: {
    fontStyle: 'italic',
  },
});

export type ProductItemPromosProps = Pick<
  ProductItemProps,
  'promoContainerStyle' | 'promos' | 'promoStyle' | 'promotions' | 'renderPromos'
>;

export class ProductItemPromos extends Component<ProductItemPromosProps> {
  public render(): React.ReactNode {
    const {
      promoContainerStyle,
      promoStyle,
      promos,
      promotions,
      renderPromos, // deprecated
    } = this.props;
    const promosList = promotions || promos;

    if (renderPromos) {
      return renderPromos();
    }

    if (!promosList || promosList.length === 0) {
      return null;
    }

    return (
      <View style={[style.container, promoContainerStyle]}>
        {promosList.map((p, i) => (
          <Text key={i} style={[types.caption, weights.light, style.promo, promoStyle]}>
            {p}
          </Text>
        ))}
      </View>
    );
  }
}
