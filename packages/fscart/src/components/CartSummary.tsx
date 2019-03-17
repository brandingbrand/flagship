import React, { FunctionComponent, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.cart.summary;

const style = StyleSheet.create({
  container: {
    margin: 10
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  }
});

export type CartSummaryProps = Pick<
  CommerceTypes.Cart,
  'shipping' | 'subtotal' | 'tax' | 'total'
>;

const CartSummary: FunctionComponent<CartSummaryProps> = (props): JSX.Element => {
  const {
    shipping,
    subtotal,
    tax,
    total
    } = props;

  return (
    <View style={style.container}>
      <View style={style.line}>
        <Text>{FSI18n.string(componentTranslationKeys.subtotal.text)}</Text>
        <Text>
          {subtotal !== undefined ?
            FSI18n.currency(subtotal) :
            FSI18n.string(componentTranslationKeys.subtotal.defaultValue)
          }
        </Text>
      </View>
      <View style={style.line}>
      <Text>{FSI18n.string(componentTranslationKeys.tax.text)}</Text>
        <Text>
          {tax !== undefined ?
            FSI18n.currency(tax) :
            FSI18n.string(componentTranslationKeys.tax.defaultValue)
          }
        </Text>
      </View>
      <View style={style.line}>
        <Text>{FSI18n.string(componentTranslationKeys.shipping.text)}</Text>
        <Text>
          {shipping !== undefined ?
            FSI18n.currency(shipping) :
            FSI18n.string(componentTranslationKeys.shipping.defaultValue)
          }
          {shipping}
        </Text>
      </View>
      <View style={style.line}>
        <Text>{FSI18n.string(componentTranslationKeys.total.text)}</Text>
        <Text>
          {total !== undefined ?
            FSI18n.currency(total) :
            FSI18n.string(componentTranslationKeys.total.defaultValue)
          }
        </Text>
      </View>
    </View>
  );
};

export default memo(CartSummary);
