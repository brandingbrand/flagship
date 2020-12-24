import React, { FC } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ProductIndexProps } from './ProductIndex';
import { times } from 'lodash-es';
import { ProductTileGhost, ProductTileGhostProps } from './ProductTileGhost';

const styles = StyleSheet.create({
  row: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

const noop = () => { /** noop */};
const renderGhostTile = (props?: ProductTileGhostProps) => () => <ProductTileGhost {...props} />;

export interface SerializableProductIndexGhostProps {
  style?: ViewStyle;
  tileProps?: ProductTileGhostProps;
}

export interface ProductIndexGhostProps extends Omit<
  SerializableProductIndexGhostProps,
  'style'
> {
  style?: StyleProp<ViewStyle>;
  renderRefineActionBar?: ProductIndexProps['renderRefineActionBar'];
}

export const ProductIndexGhost: FC<ProductIndexGhostProps> = ({
  style,
  renderRefineActionBar,
  tileProps
}) => {
  const ghostTile = renderGhostTile(tileProps);
  return (
    <View style={style}>
      {renderRefineActionBar?.(
        noop,
        noop,
        { products: [] }
      )}
      <View style={styles.row}>
        {times(4, ghostTile)}
      </View>
    </View>
  );
};
