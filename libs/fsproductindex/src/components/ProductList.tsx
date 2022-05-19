import type { FC } from 'react';
import React from 'react';

import type { StyleProp, ViewStyle } from 'react-native';

import type { GridProps } from '@brandingbrand/fscomponents';
import { Grid } from '@brandingbrand/fscomponents';

export interface ProductListProps {
  items: readonly any[] | null;
  style?: StyleProp<ViewStyle>;
  columns?: number;
  gridProps?: Partial<GridProps<any>>;
  renderItem: GridProps<any>['renderItem'];
  renderHeader?: () => JSX.Element | null;
  renderFooter?: () => JSX.Element | null;
}

export const ProductList: FC<ProductListProps> = (props) => {
  const { columns, gridProps, items, renderFooter, renderHeader, renderItem, style } = props;

  return (
    <Grid
      columns={columns}
      data={items}
      renderFooter={renderFooter}
      renderHeader={renderHeader}
      renderItem={renderItem}
      style={style}
      {...gridProps}
    />
  );
};
