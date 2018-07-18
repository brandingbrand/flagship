import React, { Component } from 'react';
import {
  StyleSheet,
  Text
} from 'react-native';

import { ProductItemProps } from '../ProductItem';
import { types } from '../../../styles/variables';

export type ProductItemBrandProps = Pick<ProductItemProps, 'brand' | 'brandStyle' | 'renderBrand'>;

const styles = StyleSheet.create({
  brand: {
    marginBottom: 4
  }
});

export class ProductItemBrand extends Component<ProductItemBrandProps> {
  render(): React.ReactNode {
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
