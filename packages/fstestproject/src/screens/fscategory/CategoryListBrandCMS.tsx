import React, { Component } from 'react';
import { CommerceTypes, WithCommerceDataProps } from '@brandingbrand/fscommerce';
import { CategoryList } from '@brandingbrand/fscategory';
import {
  cmsProductCatalog
} from '../../lib/datasource';

export default class CategoryListBrandCMS extends Component<
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
      <CategoryList
        commerceData={this.state.commerceData}
        onNavigate={this.goTo}
        categoryItemProps={{
          style: { height: 60 },
          imageStyle: { width: 35, height: 35 }
        }}
      />
    );
  }
}
