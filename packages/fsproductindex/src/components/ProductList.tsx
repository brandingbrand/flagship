import React, { FunctionComponent, memo } from 'react';
import { Grid } from '@brandingbrand/fscomponents';

export interface ProductListProps {
  items?: any;
  style?: any;
  columns?: number;
  gridProps?: any;
  renderItem?: any;
  renderHeader?: any;
  renderFooter?: any;
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
