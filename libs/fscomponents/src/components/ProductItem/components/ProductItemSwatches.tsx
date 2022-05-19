import React, { Component } from 'react';

import { StyleSheet } from 'react-native';

import { Swatches } from '../../Swatches';
import type { ProductItemProps } from '../ProductItem';

const styles = StyleSheet.create({
  swatches: {
    marginBottom: 10,
  },
});

export type ProductItemSwatchesProps = Pick<
  ProductItemProps,
  'renderSwatches' | 'swatchesProps' | 'swatchItems' | 'swatchStyle'
>;

export class ProductItemSwatches extends Component<ProductItemSwatchesProps> {
  public render(): React.ReactNode {
    const { renderSwatches, swatchItems, swatchStyle, swatchesProps } = this.props;

    if (renderSwatches) {
      return renderSwatches();
    }

    if (!swatchItems) {
      return null;
    }

    return (
      <Swatches items={swatchItems} style={[styles.swatches, swatchStyle]} {...swatchesProps} />
    );
  }
}
