import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Swatches } from '../../Swatches';
import { ProductItemProps } from '../ProductItem';

const styles = StyleSheet.create({
  swatches: {
    marginBottom: 10
  }
});

export type ProductItemSwatchesProps = Pick<
  ProductItemProps,
  'swatchItems' | 'swatchStyle' | 'swatchesProps' | 'renderSwatches'
>;

export const ProductItemSwatches: FunctionComponent<ProductItemSwatchesProps> =
(props): React.ReactElement<any> | null => {

  const {
    swatchItems,
    swatchStyle,
    swatchesProps,
    renderSwatches
  } = props;

  if (renderSwatches) {
    return renderSwatches();
  }

  if (!swatchItems) {
    return null;
  }

  return (
    <Swatches items={swatchItems} style={[styles.swatches, swatchStyle]} {...swatchesProps} />
  );
};

