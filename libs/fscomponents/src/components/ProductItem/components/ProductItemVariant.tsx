import React, { Component } from 'react';

import { StyleSheet, Text } from 'react-native';

import type { ProductItemProps } from '../ProductItem';

const style = StyleSheet.create({
  variantText: {
    fontSize: 12,
  },
});

export type ProductItemVariantProps = Pick<
  ProductItemProps,
  'renderVariantText' | 'variantText' | 'variantTextStyle'
>;

export class ProductItemVariant extends Component<ProductItemVariantProps> {
  public render(): React.ReactNode {
    const { renderVariantText, variantText, variantTextStyle } = this.props;

    if (renderVariantText) {
      return renderVariantText();
    }

    if (!variantText) {
      return null;
    }

    return <Text style={[style.variantText, variantTextStyle]}>{variantText}</Text>;
  }
}
