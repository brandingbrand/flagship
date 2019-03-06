import React, { FunctionComponent } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { ProductItemProps } from '../ProductItem';
import { types, weights } from '../../../styles/variables';

const style = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  promo: {
    fontStyle: 'italic'
  }
});

export type ProductItemPromosProps = Pick<
  ProductItemProps,
  'promotions' | 'promoStyle' | 'promoContainerStyle' | 'renderPromos' | 'promos'
>;

export const ProductItemPromos: FunctionComponent<ProductItemPromosProps> =
(props): React.ReactElement<any> | null => {

  const {
    promotions,
    promoStyle,
    promoContainerStyle,
    renderPromos,
    promos // deprecated
  } = props;
  const promosList = promotions || promos;

  if (renderPromos) {
    return renderPromos();
  }

  if (!promosList || !promosList.length) {
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
};

