import React, { FunctionComponent, memo } from 'react';

import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.cart.itemsInCart;

const DEFAULT_CART_IMAGE = require('../../assets/images/cart.png');

export type TextPositions = 'topLeft' | 'topRight' | 'center' | 'bottomLeft' | 'bottomRight';

export interface SerializableCartCountProps {
  // Optional alternate URI for the cart image; if different than 25x25 will need restyled
  cartImage?: ImageURISource;
  // Styles for the cart image
  cartImageStyle?: ImageStyle;
  // The cart count; won't display if zero
  count: number;
  // The style of the main container
  style?: ViewStyle;
  // Position of the item count; defaults to center
  textPosition: TextPositions;
  // Styles for the item count
  textStyle?: TextStyle;
}

export interface CartCountProps extends Omit<
  SerializableCartCountProps,
  'cartImageStyle' |
  'style' |
  'textStyle'> {
  // Styles for the cart image
  cartImageStyle?: StyleProp<ImageStyle>;
  // The style of the main container
  style?: StyleProp<ViewStyle>;
  // Styles for the item count
  textStyle?: StyleProp<TextStyle>;
}

const styles = StyleSheet.create({
  container: {
    width: 33,  // image width + (padding * 2)
    height: 33, // image width + (padding * 2)
    padding: 4
  },
  image: {
    height: 25,
    width: 25
  },
  text: {
    color: 'white',
    position: 'absolute',
    padding: 1,
    borderRadius: 7,
    backgroundColor: 'red',
    fontSize: 10,
    width: 14,
    height: 14,
    textAlign: 'center',
    overflow: 'hidden'
  },
  topLeft: {
    top: 0,
    left: 0
  },
  topRight: {
    top: 0,
    right: 0
  },
  bottomLeft: {
    bottom: 0,
    left: 0
  },
  bottomRight: {
    bottom: 0,
    right: 0
  },
  center: {
    alignSelf: 'center',
    marginTop: 8
  }
});

export const CartCount: FunctionComponent<CartCountProps> = memo((props): JSX.Element => {

  const textPosition = props.textPosition || 'center';
  const accessibilityString = FSI18n.number(props.count)
    + ' ' + FSI18n.string(componentTranslationKeys);
  return (
    <View
      style={[styles.container, props.style]}
      accessibilityLabel={accessibilityString}
    >
      <Image
        resizeMode='contain'
        style={[styles.image, props.cartImageStyle]}
        source={props.cartImage || DEFAULT_CART_IMAGE}
        accessibilityRole={'image'}
        accessibilityLabel={accessibilityString}
      />
      {props.count && (
        <Text style={[styles.text, styles[textPosition], props.textStyle]}>
          {props.count}
        </Text>
      )}
    </View>
  );

});
