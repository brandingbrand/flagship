import React, { Component } from 'react';

import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import heartIcon from '../../../../assets/images/heartIcon.png';
import type { ProductItemProps } from '../ProductItem';

const style = StyleSheet.create({
  favButton: {
    height: 30,
    width: 30,
  },
  favButtonContainer: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
});

export type ProductItemFavoriteButtonProps = Pick<
  ProductItemProps,
  'favButtonImage' | 'onFavButtonPress' | 'renderFavButton'
>;

export class ProductItemFavoriteButton extends Component<ProductItemFavoriteButtonProps> {
  public render(): React.ReactNode {
    const { favButtonImage, onFavButtonPress, renderFavButton } = this.props;

    if (renderFavButton) {
      return renderFavButton();
    }

    if (!onFavButtonPress) {
      return null;
    }

    return (
      <TouchableOpacity
        accessibilityLabel="Toggle Favorite"
        onPress={onFavButtonPress}
        style={style.favButtonContainer}
      >
        <Image resizeMode="contain" source={favButtonImage || heartIcon} style={style.favButton} />
      </TouchableOpacity>
    );
  }
}
