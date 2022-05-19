import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

import type { CommerceTypes } from '@brandingbrand/fscommerce';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const componentTranslationKeys = translationKeys.flagship.cart.item;

const defaultStyles = StyleSheet.create({
  detailText: {
    paddingBottom: 5,
  },
});

export interface CartItemDetailsProps
  extends Pick<CommerceTypes.CartItem, 'itemText' | 'price' | 'productId' | 'totalPrice'> {
  style?: StyleProp<ViewStyle>;
  detailTextStyle?: StyleProp<TextStyle>;
}

export const CartItemDetails: FunctionComponent<CartItemDetailsProps> = memo(
  (props): JSX.Element => {
    const { detailTextStyle, itemText, price, productId, style, totalPrice } = props;

    let convertedPrice: string | undefined;
    try {
      if (price) {
        convertedPrice = FSI18n.currency(price);
      }
    } catch (error) {
      console.error(error);
    }

    let convertedTotalPrice: string | undefined;
    try {
      if (totalPrice) {
        convertedTotalPrice = FSI18n.currency(totalPrice);
      }
    } catch (error) {
      console.error(error);
    }

    return (
      <View style={style}>
        {itemText && <Text style={[defaultStyles.detailText, detailTextStyle]}>{itemText}</Text>}
        {productId && <Text style={[defaultStyles.detailText, detailTextStyle]}>#{productId}</Text>}
        {convertedPrice && (
          <Text style={[defaultStyles.detailText, detailTextStyle]}>
            {FSI18n.string(componentTranslationKeys.unitPrice)}:{convertedPrice}
          </Text>
        )}
        {convertedTotalPrice && (
          <Text style={detailTextStyle}>
            {FSI18n.string(componentTranslationKeys.totalPrice)}:{convertedTotalPrice}
          </Text>
        )}
      </View>
    );
  }
);
