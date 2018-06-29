import React, { Component } from 'react';

import { ProductDetail } from '@brandingbrand/fsproductdetail';
import { demandware } from '../../lib/datasource';

export default class ProductDetailExample extends Component<any> {
  render(): JSX.Element {
    return (
      <ProductDetail
        commerceDataSource={demandware}
        commerceToReviewMap='id'
        id='25589652'
      />
    );
  }
}
