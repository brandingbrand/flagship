import React, { FunctionComponent, memo } from 'react';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.cart.item;

const defaultStyles = StyleSheet.create({
  detailText: {
    paddingBottom: 5
  }
});

export interface CartItemDetailsProps extends Pick<
  CommerceTypes.CartItem,
  'itemText' | 'productId' | 'price' | 'totalPrice'
  > {
  style?: StyleProp<ViewStyle>;
  detailTextStyle?: StyleProp<TextStyle>;
}

export const CartItemDetails: FunctionComponent<CartItemDetailsProps> =
memo((props): JSX.Element => {
  const {
    detailTextStyle,
    itemText,
    price,
    productId,
    style,
    totalPrice
  } = props;

  return (
    <View style={style}>
      {itemText && <Text style={[defaultStyles.detailText, detailTextStyle]}>{itemText}</Text>}
      {productId && <Text style={[defaultStyles.detailText, detailTextStyle]}>#{productId}</Text>}
      {price && (
        <Text style={[defaultStyles.detailText, detailTextStyle]}>
          {FSI18n.string(componentTranslationKeys.unitPrice)}:
          {FSI18n.currency(price)}
        </Text>
      )}
      {totalPrice && <Text style={detailTextStyle}>
        {FSI18n.string(componentTranslationKeys.totalPrice)}:
        {FSI18n.currency(totalPrice)}
      </Text>}
    </View>
  );
});
