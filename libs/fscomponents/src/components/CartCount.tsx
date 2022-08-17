import type { FC } from 'react';
import React, { memo } from 'react';

import type { ImageStyle, ImageURISource, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Image, StyleSheet, Text, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import DEFAULT_CART_IMAGE from '../../assets/images/cart.png';

const componentTranslationKeys = translationKeys.flagship.cart.itemsInCart;

export type TextPositions = 'bottomLeft' | 'bottomRight' | 'center' | 'topLeft' | 'topRight';

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

export interface CartCountProps
  extends Omit<SerializableCartCountProps, 'cartImageStyle' | 'style' | 'textStyle'> {
  // Styles for the cart image
  cartImageStyle?: StyleProp<ImageStyle>;
  // The style of the main container
  style?: StyleProp<ViewStyle>;
  // Styles for the item count
  textStyle?: StyleProp<TextStyle>;
}

const styles = StyleSheet.create({
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  center: {
    alignSelf: 'center',
    marginTop: 8,
  },
  container: {
    width: 33, // image width + (padding * 2)
    height: 33, // image width + (padding * 2)
    padding: 4,
  },
  image: {
    height: 25,
    width: 25,
  },
  text: {
    backgroundColor: 'red',
    borderRadius: 7,
    color: 'white',
    fontSize: 10,
    height: 14,
    overflow: 'hidden',
    padding: 1,
    position: 'absolute',
    textAlign: 'center',
    width: 14,
  },
  topLeft: {
    left: 0,
    top: 0,
  },
  topRight: {
    right: 0,
    top: 0,
  },
});

export const CartCount: FC<CartCountProps> = memo((props): JSX.Element => {
  const textPosition = props.textPosition || 'center';
  const accessibilityString = `${FSI18n.number(props.count)} ${FSI18n.string(
    componentTranslationKeys
  )}`;
  return (
    <View accessibilityLabel={accessibilityString} style={[styles.container, props.style]}>
      <Image
        accessibilityLabel={accessibilityString}
        accessibilityRole="image"
        resizeMode="contain"
        source={props.cartImage || DEFAULT_CART_IMAGE}
        style={[styles.image, props.cartImageStyle]}
      />
      {props.count ? (
        <Text style={[styles.text, styles[textPosition], props.textStyle]}>{props.count}</Text>
      ) : null}
    </View>
  );
});
