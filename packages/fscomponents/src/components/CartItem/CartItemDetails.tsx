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

  let convertedPrice: string | undefined;
  try {
    if (price) {
      convertedPrice = FSI18n.currency(price);
    }
  } catch (e) {
    console.error(e);
  }

  let convertedTotalPrice: string | undefined;
  try {
    if (totalPrice) {
      convertedTotalPrice = FSI18n.currency(totalPrice);
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <View style={style}>
      {itemText && <Text style={[defaultStyles.detailText, detailTextStyle]}>{itemText}</Text>}
      {productId && <Text style={[defaultStyles.detailText, detailTextStyle]}>#{productId}</Text>}
      {convertedPrice && (
        <Text style={[defaultStyles.detailText, detailTextStyle]}>
          {FSI18n.string(componentTranslationKeys.unitPrice)}:
          {convertedPrice}
        </Text>
      )}
      {convertedTotalPrice && (
        <Text style={detailTextStyle}>
          {FSI18n.string(componentTranslationKeys.totalPrice)}:
          {convertedTotalPrice}
        </Text>
      )}
    </View>
  );
});
