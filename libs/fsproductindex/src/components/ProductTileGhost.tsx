import type { FC } from 'react';
import React from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';

import favorite from '../../assets/images/Favorite.png';
import ContentLoader, { Rect } from '../lib/RNContentLoader';

const icons = {
  favorite,
};

const styles = StyleSheet.create({
  favoriteIcon: {
    height: 18,
    resizeMode: 'contain',
    width: 19,
  },
  favoriteWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 35,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 35,
    zIndex: 9999,
  },
});

export interface SerializableProductTileGhostProps {
  style?: ViewStyle;
  height?: number;
  width?: number;
  backgroundColor?: string;
  foregroundColor?: string;
}

export interface ProductTileGhostProps extends Omit<SerializableProductTileGhostProps, 'style'> {
  style?: StyleProp<ViewStyle>;
}

export const ProductTileGhost: FC<ProductTileGhostProps> = ({
  backgroundColor = '#EFEFEF',
  foregroundColor = '#F9F9F9',
  height = 350,
  style,
  width = 175,
}) => (
  <View style={style}>
    <View style={styles.favoriteWrap}>
      <Image source={icons.favorite} style={styles.favoriteIcon} />
    </View>
    <ContentLoader
      backgroundColor={backgroundColor}
      foregroundColor={foregroundColor}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <Rect height="221" rx="4" ry="4" width={width} x="0" y="0" />
      <Rect height="18" rx="4" ry="4" width="142" x="10" y="231" />
      <Rect height="18" rx="4" ry="4" width="96" x="10" y="260" />
      <Rect height="18" rx="4" ry="4" width="96" x="10" y="284" />
    </ContentLoader>
  </View>
);
