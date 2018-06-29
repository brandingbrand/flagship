import React, { Component } from 'react';
import { ProductIndex } from '@brandingbrand/fsproductindex';
import { demandware } from '../../lib/datasource';

export default class ProductIndexDemandwareGrid extends Component<any> {
  goTo = (data: any) => {
    alert(JSON.stringify(data));
  }

  render(): JSX.Element {
    return (
      <ProductIndex
        commerceDataSource={demandware}
        reviewProvider='powerreviews'
        reviewProviderConfig={{
          endpoint: 'https://readservices-b2c.powerreviews.com/',
          apikey: '',
          merchantId: ''
        }}
        commerceToReviewMap='id'
        modalType='half-screen'
        filterType='drilldown'
        mergeSortToFilter={true}
        onNavigate={this.goTo}
        productQuery={{
          categoryId: 'baking-cupcake-supplies',
          limit: 6
        }}
        refineActionBarProps={{
          filterButtonStyle: {
            backgroundColor: 'yellow'
          }
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
          }
        }}
        FilterListDrilldownProps={{
          selectableRowProps: {
            style: { backgroundColor: 'red' }
          }
        }}
      />
    );
  }
}
