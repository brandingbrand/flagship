import React, { Component } from 'react';
import { CommerceTypes, WithCommerceDataProps } from '@brandingbrand/fscommerce';
import { CategoryGrid } from '@brandingbrand/fscategory';
import {
  cmsProductCatalog
} from '../../lib/datasource';

export default class CategoryGridBrandCMS extends Component<
  never,
  WithCommerceDataProps<CommerceTypes.Category>
> {
  componentDidMount(): void {
    cmsProductCatalog
      .fetchCategory('home/home-category-grid')
      .then(category => this.setState({ commerceData: category }))
      .catch(e => console.warn('Error fetching cms categories', e));
  }

  goTo = (data: CommerceTypes.Category) => {
    alert(JSON.stringify(data));
  }

  render(): JSX.Element | null {
    if (!this.state) {
      return null;
    }

    return (
      <CategoryGrid
        commerceData={this.state.commerceData}
        onNavigate={this.goTo}
        columns={3}
        categoryItemProps={{
          titleStyle: {
            textAlign: 'center',
            marginTop: 10,
            fontSize: 12,
            color: '#555'
          },
          imageStyle: {
            width: 80,
            height: 80
          }
        }}
      />
    );
  }
}
