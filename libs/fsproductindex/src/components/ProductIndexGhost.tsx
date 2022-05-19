import type { FC } from 'react';
import React from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { times } from 'lodash-es';

import type { ProductIndexProps } from './ProductIndex';
import type { ProductTileGhostProps } from './ProductTileGhost';
import { ProductTileGhost } from './ProductTileGhost';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

const noop = () => {
  /** noop */
};
const renderGhostTile = (props?: ProductTileGhostProps) => () => <ProductTileGhost {...props} />;

export interface SerializableProductIndexGhostProps {
  style?: ViewStyle;
  tileProps?: ProductTileGhostProps;
}

export interface ProductIndexGhostProps extends Omit<SerializableProductIndexGhostProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  renderRefineActionBar?: ProductIndexProps['renderRefineActionBar'];
}

export const ProductIndexGhost: FC<ProductIndexGhostProps> = ({
  renderRefineActionBar,
  style,
  tileProps,
}) => {
  const ghostTile = renderGhostTile(tileProps);
  return (
    <View style={style}>
      {renderRefineActionBar?.(noop, noop, { products: [] })}
      <View style={styles.row}>{times(4, ghostTile)}</View>
    </View>
  );
};
