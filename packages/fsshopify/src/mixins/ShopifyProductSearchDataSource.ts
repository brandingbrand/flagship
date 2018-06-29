import {
  CommerceTypes as FSCommerceTypes,
  ProductSearchDataSource
} from '@brandingbrand/fscommerce';
import DataSourceBase from '../util/DataSourceBase';

export class ShopifyProductSearchDataSource extends DataSourceBase
  implements ProductSearchDataSource {
  async search(
    keyword: string,
    query?: FSCommerceTypes.ProductQuery
  ): Promise<FSCommerceTypes.ProductIndex> {
    return Promise.reject('Not Implemented');
  }

  async searchSuggestion(keyword: string): Promise<FSCommerceTypes.SearchSuggestion> {
    return Promise.reject('Not Implemented');
  }
}
