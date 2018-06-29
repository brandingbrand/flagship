import React, { Component } from 'react';
import { Swatches } from '../../Swatches';
import { ProductItemProps } from '../ProductItemProps';

export type ProductItemSwatchesProps = Pick<
  ProductItemProps,
  'swatchItems' | 'swatchStyle' | 'swatchesProps' | 'renderSwatches'
>;

export class ProductItemSwatches extends Component<ProductItemSwatchesProps> {
  render(): React.ReactNode {
    const {
      swatchItems,
      swatchStyle,
      swatchesProps,
      renderSwatches
    } = this.props;

    if (renderSwatches) {
      return renderSwatches();
    }

    if (!swatchItems) {
      return null;
    }

    return (
      <Swatches items={swatchItems} style={swatchStyle} {...swatchesProps} />
    );
  }
}
