import React, { Component } from 'react';

import { ProductDetail } from '@brandingbrand/fsproductdetail';
import { mockCommerceDataSource } from '../../lib/datasource';

export default class ProductDetailExample extends Component<any> {
  render(): JSX.Element {
    return (
      <ProductDetail
        commerceDataSource={mockCommerceDataSource}
        commerceToReviewMap='id'
        id='P0150'
      />
    );
  }
}
