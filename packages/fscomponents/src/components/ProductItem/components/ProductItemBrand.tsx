import React, { Component } from 'react';
import {
  Text
} from 'react-native';

import { ProductItemProps } from '../ProductItemProps';

export type ProductItemBrandProps = Pick<ProductItemProps, 'brand' | 'brandStyle' | 'renderBrand'>;

export class ProductItemBrand extends Component<ProductItemBrandProps> {
  render(): React.ReactNode {
    const { brand, brandStyle, renderBrand } = this.props;

    if (renderBrand) {
      return renderBrand();
    }

    if (!brand) {
      return null;
    }

    return <Text style={brandStyle}>{brand}</Text>;
  }
}
