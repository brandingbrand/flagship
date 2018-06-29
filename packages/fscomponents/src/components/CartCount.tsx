import React, { PureComponent } from 'react';

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

const DEFAULT_CART_IMAGE = require('../../assets/images/cart.png');

export type TextPositions = 'topLeft' | 'topRight' | 'center' | 'bottomLeft' | 'bottomRight';

export interface CartCountProps {
  // Optional alternate URI for the cart image; if different than 25x25 will need restyled
  cartImage?: ImageURISource;
  // Styles for the cart image
  cartImageStyle?: StyleProp<ImageStyle>;
  // The cart count; won't display if zero
  count: number;
  // The style of the main container
  style?: StyleProp<ViewStyle>;
  // Position of the item count; defaults to center
  textPosition: TextPositions;
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

export class CartCount extends PureComponent<CartCountProps> {
  render(): JSX.Element {
    const textPosition = this.props.textPosition || 'center';

    return (
      <View style={[styles.container, this.props.style]}>
        <Image
          resizeMode='contain'
          style={[styles.image, this.props.cartImageStyle]}
          source={this.props.cartImage || DEFAULT_CART_IMAGE}
        />
        {this.props.count && (
          <Text
            style={[styles.text, styles[textPosition], this.props.textStyle]}
          >
            {this.props.count}
          </Text>
        )}
      </View>
    );
  }
}
