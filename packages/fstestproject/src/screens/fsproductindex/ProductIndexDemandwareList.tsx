import React, { Component } from 'react';
import { ProductIndex } from '@brandingbrand/fsproductindex';
import { demandware, powerreviews } from '../../lib/datasource';

export default class ProductIndexDemandwareList extends Component<any> {
  goTo = (data: any) => {
    alert(JSON.stringify(data));
  }

  render(): JSX.Element {
    return (
      <ProductIndex
        commerceDataSource={demandware}
        reviewDataSource={powerreviews}
        commerceToReviewMap='id'
        onNavigate={this.goTo}
        format='list'
        productQuery={{
          categoryId: 'mens'
        }}
        productItemProps={{
          contentStyle: {
            alignItems: 'center'
          },
          brandStyle: {
            marginBottom: 5
          },
          titleStyle: {
            fontSize: 13,
            marginBottom: 10,
            textAlign: 'center'
          },
          priceStyle: {
            fontSize: 20
          },
          promoStyle: {
            textAlign: 'center',
            marginBottom: 5,
            fontWeight: 'bold',
            fontSize: 12
          },
          promoContainerStyle: {
            marginTop: 10
          },
          imageStyle: {
            width: 200,
            height: 200
          }
        }}
      />
    );
  }
}
