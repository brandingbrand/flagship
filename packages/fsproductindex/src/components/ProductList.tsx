import React, { FunctionComponent, memo } from 'react';
import { Grid, GridProps } from '@brandingbrand/fscomponents';
import { StyleProp, ViewStyle } from 'react-native';

export interface ProductListProps {
  items: readonly any[] | null;
  style?: StyleProp<ViewStyle>;
  columns?: number;
  gridProps?: Partial<GridProps<any>>;
  renderItem: GridProps<any>['renderItem'];
  renderHeader?: () => JSX.Element | null;
  renderFooter?: () => JSX.Element | null;
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
