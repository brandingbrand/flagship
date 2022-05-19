import React, { Component } from 'react';

import { StyleSheet, Text } from 'react-native';

import { types } from '../../../styles/variables';
import type { ProductItemProps } from '../ProductItem';

export type ProductItemBrandProps = Pick<ProductItemProps, 'brand' | 'brandStyle' | 'renderBrand'>;

const styles = StyleSheet.create({
  brand: {
    marginBottom: 4,
  },
});

export class ProductItemBrand extends Component<ProductItemBrandProps> {
  public render(): React.ReactNode {
    const { brand, brandStyle, renderBrand } = this.props;

    if (renderBrand) {
      return renderBrand();
    }

    if (!brand) {
      return null;
    }

    return <Text style={[types.caption, styles.brand, brandStyle]}>{brand.toUpperCase()}</Text>;
  }
}
