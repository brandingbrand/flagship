import React, { FC } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import ContentLoader, { Rect } from '../lib/RNContentLoader';

const icons = {
  favorite: require('../../assets/images/Favorite.png')
};

const styles = StyleSheet.create({
  favoriteWrap: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 9999,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18
  },
  favoriteIcon: {
    width: 19,
    height: 18,
    resizeMode: 'contain'
  }
});

export interface SerializableProductTileGhostProps {
  style?: ViewStyle;
  height?: number;
  width?: number;
  backgroundColor?: string;
  foregroundColor?: string;
}

export interface ProductTileGhostProps extends Omit<
  SerializableProductTileGhostProps,
  'style'
> {
  style?: StyleProp<ViewStyle>;
}

export const ProductTileGhost: FC<ProductTileGhostProps> = ({
  style,
  height = 350,
  width = 175,
  backgroundColor = '#EFEFEF',
  foregroundColor = '#F9F9F9'
}) => {
  return (
    <View style={style}>
      <View
        style={styles.favoriteWrap}
      >
        <Image
          source={icons.favorite}
          style={styles.favoriteIcon}
        />
      </View>
      <ContentLoader
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
      >
        <Rect x='0' y='0' rx='4' ry='4' width={width} height='221' />
        <Rect x='10' y='231' rx='4' ry='4' width='142' height='18' />
        <Rect x='10' y='260' rx='4' ry='4' width='96' height='18' />
        <Rect x='10' y='284' rx='4' ry='4' width='96' height='18' />
      </ContentLoader>
    </View>
  );
};
