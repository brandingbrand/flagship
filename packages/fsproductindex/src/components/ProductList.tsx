import React, { FunctionComponent, memo } from 'react';
import { Grid, GridProps } from '@brandingbrand/fscomponents';
import { ListRenderItemInfo, StyleProp, ViewStyle } from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';

export interface ProductListProps<ItemT extends CommerceTypes.Product = CommerceTypes.Product> {
  items: ItemT[];
  style: StyleProp<ViewStyle>;
  columns?: number;
  gridProps?: Partial<GridProps<ItemT>>;
  renderItem: ({ item }: ListRenderItemInfo<ItemT>) => JSX.Element;
  renderHeader: () => JSX.Element | null;
  renderFooter: () => JSX.Element | null;
}

const ProductList: FunctionComponent<ProductListProps> = (props): JSX.Element => {
  const {
    items,
    style,
    columns,
    gridProps,
    renderItem,
    renderHeader,
    renderFooter
  } = props;

  return (
    <Grid
      style={style}
      columns={columns}
      data={items}
      renderItem={renderItem}
      renderHeader={renderHeader}
      renderFooter={renderFooter}
      {...gridProps}
    />
  );
};

export default memo(ProductList);
