import React, { FunctionComponent } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { ProductItemProps } from '../ProductItem';

const heartIcon = require('../../../../assets/images/heartIcon.png');

const style = StyleSheet.create({
  favButtonContainer: {
    position: 'absolute',
    top: 5,
    right: 5
  },
  favButton: {
    width: 30,
    height: 30
  }
});

export type ProductItemFavoriteButtonProps = Pick<
  ProductItemProps,
  'renderFavButton' | 'onFavButtonPress' | 'favButtonImage'
>;

export const ProductItemFavoriteButton:
FunctionComponent<ProductItemFavoriteButtonProps> = (props): React.ReactElement<any> | null => {

  const { renderFavButton, onFavButtonPress, favButtonImage } = props;

  if (renderFavButton) {
    return renderFavButton();
  }

  if (!onFavButtonPress) {
    return null;
  }

  return (
    <TouchableOpacity
      accessibilityLabel='Toggle Favorite'
      onPress={onFavButtonPress}
      style={style.favButtonContainer}
    >
      <Image
        resizeMode='contain'
        source={favButtonImage || heartIcon}
        style={style.favButton}
      />
    </TouchableOpacity>
  );
};

