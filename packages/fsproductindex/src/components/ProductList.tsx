import React, { PureComponent } from 'react';
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

export default class ProductList extends PureComponent<ProductListProps> {
  render(): JSX.Element {
    const {
      items,
      style,
      columns,
      gridProps,
      renderItem,
      renderHeader,
      renderFooter
    } = this.props;

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
  }
}
