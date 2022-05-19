import React, { Component } from 'react';

import type { CommerceDataSource, CommerceTypes } from '@brandingbrand/fscommerce';

import type { UnwrappedProductIndexProps } from './ProductIndex';
import { ProductIndex } from './ProductIndex';
import type { WithProductIndexProps, WithProductIndexProviderProps } from './ProductIndexProvider';
import { default as withProductIndexData } from './ProductIndexProvider';

// TODO: This makes keyword required for searches. This should be done in fscommerce and the
// separate keyword parameter for CommerceDataSource should be removed.
export interface SearchProductQuery extends CommerceTypes.ProductQuery {
  keyword: string;
}

export interface UnwrappedProductIndexSearchProps extends UnwrappedProductIndexProps {
  productQuery: SearchProductQuery;
}

export type ProductIndexSearchProps = UnwrappedProductIndexSearchProps &
  WithProductIndexProviderProps;

// patch fetch products so sort and filter uses this instead of fetchProductIndex
export class ProductIndexSearch extends Component<
  UnwrappedProductIndexSearchProps & WithProductIndexProps
> {
  private readonly fetchProducts = async (query?: CommerceTypes.ProductQuery) => {
    if (this.props.commerceDataSource) {
      return this.props.commerceDataSource.search(this.props.productQuery.keyword, query);
    }
    throw new Error('FSProductIndex: [this.props.commerceDataSource] is required.');
  };

  public render(): JSX.Element {
    const searchProps = {
      ...this.props,
      fetchProducts: this.fetchProducts,
    };
    return <ProductIndex {...searchProps} />;
  }
}

export default withProductIndexData<UnwrappedProductIndexSearchProps>(
  async (dataSource: CommerceDataSource, props: UnwrappedProductIndexSearchProps) =>
    dataSource.search(props.productQuery.keyword, props.productQuery)
)(ProductIndexSearch);
