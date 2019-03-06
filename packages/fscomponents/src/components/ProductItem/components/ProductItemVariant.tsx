import React, { FunctionComponent } from 'react';
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

export const ProductItemVariant: FunctionComponent<ProductItemVariantProps> =
(props): React.ReactNode | any => {

  const { variantText, variantTextStyle, renderVariantText } = props;

  if (renderVariantText) {
    return renderVariantText();
  }

  if (!variantText) {
    return null;
  }

  return <Text style={[style.variantText, variantTextStyle]}>{variantText}</Text>;
};

