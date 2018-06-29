import React, { Component } from 'react';
import { ProductIndexSearch } from '@brandingbrand/fsproductindex';
import { demandware } from '../../lib/datasource';

export default class ProductIndexShopifyList extends Component<any> {
  goTo = (data: any) => {
    alert(JSON.stringify(data));
  }

  render(): JSX.Element {
    return (
      <ProductIndexSearch
        commerceDataSource={demandware}
        reviewProvider='powerreviews'
        reviewProviderConfig={{
          endpoint: 'https://readservices-b2c.powerreviews.com/',
          apikey: '',
          merchantId: ''
        }}
        commerceToReviewMap='id'
        onNavigate={this.goTo}
        productQuery={{
          keyword: 'mega'
        }}
        productItemProps={{
          contentStyle: {
            alignItems: 'center'
          },
          brandStyle: {
            marginBottom: 5,
            fontSize: 13,
            fontWeight: 'bold'
          },
          titleStyle: {
            fontSize: 12,
            marginBottom: 15,
            textAlign: 'center',
            fontWeight: 'normal'
          },
          imageStyle: {
            width: 150,
            height: 150
          }
        }}
      />
    );
  }
}
