import React, { Component } from 'react';
import {
  StyleSheet,
  Text
} from 'react-native';

import { ProductItemProps } from '../ProductItem';

const style = StyleSheet.create({
  variantText: {
    fontSize: 12
  }
});

export type ProductItemVariantProps = Pick<
  ProductItemProps,
  'variantText' | 'variantTextStyle' | 'renderVariantText'
>;

export class ProductItemVariant extends Component<ProductItemVariantProps> {
  render(): React.ReactNode {
    const { variantText, variantTextStyle, renderVariantText } = this.props;

    if (renderVariantText) {
      return renderVariantText();
    }

    if (!variantText) {
      return null;
    }

    return <Text style={[style.variantText, variantTextStyle]}>{variantText}</Text>;
  }
}
