import {
  CommerceTypes as FSCommerceTypes,
  ProductCatalogDataSource
} from '@brandingbrand/fscommerce';
import DataSourceBase from '../util/DataSourceBase';
import * as ShopifyTypes from '../customTypes';
import * as Normalizers from '../normalizers';
import ShopifyAPIError from '../util/ShopifyAPIError';

export class ShopifyProductCatalogDataSource extends DataSourceBase
  implements ProductCatalogDataSource {

  async fetchProduct(id: string): Promise<FSCommerceTypes.Product> {
    return Normalizers.product(await this.api.getProduct(id), this.config.storeCurrencyCode);
  }

  async fetchProductIndex(
    query: FSCommerceTypes.ProductQuery
  ): Promise<ShopifyTypes.ShopifyProductIndex> {
    if (!query.categoryId) {
      throw new ShopifyAPIError('categoryId is required for fetchProductIndex');
    }
    const collectionId = query.categoryId;
    const { limit = 250 } = query;
    const response = await this.api.getCollection(collectionId, limit);
    const hasNextPage = response.products.pageInfo.hasNextPage;
    const hasPreviousPage = response.products.pageInfo.hasPreviousPage;

    return {
      ...Normalizers.productIndex(response, this.config.storeCurrencyCode),
      limit,
      hasNextPage,
      hasPreviousPage,
      nextPage: hasNextPage ?
        response.products.edges[response.products.edges.length - 1].cursor : undefined
    };
  }

  async fetchCategory(
    id?: string,
    query?: FSCommerceTypes.CategoryQuery
  ): Promise<FSCommerceTypes.Category> {
    if (id || query) {
      throw new ShopifyAPIError('ShopifyDataSource does not support fetching ' +
        'specific category ids, use fetchProductIndex');
    }

    const categories = await this.api.getAllCollections();

    return {
      id: '',
      title: 'All Categories',
      handle: '',
      categories: categories.map(Normalizers.category)
    };
  }
}
