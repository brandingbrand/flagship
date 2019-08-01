import { DemandwareBase } from './Base';
import {
  CommerceTypes as FSCommerceTypes,
  ProductCatalogDataSource,
  ProductSearchDataSource,
  runMiddleware
} from '@brandingbrand/fscommerce';
import demandwareDenormalizer from '../DemandwareDenormalizer';
import demandwareNormalizer from '../DemandwareNormalizer';
import qs from 'qs';

export class DemandwareProductCatalogAndSearchDataSource extends DemandwareBase
                                                         implements ProductCatalogDataSource,
                                                                    ProductSearchDataSource {
  /**
   * Fetch metadata about a category specified by its identifier or a query.
   *
   * @param {string} id - An identifier corresponding to a category
   * @param {CategoryQuery} query - Options specifying a category to search for
   * @returns {Promise.<Category>} A promise representing a normalized category object
   */
  async fetchCategory(
    id?: string,
    query?: FSCommerceTypes.CategoryQuery
  ): Promise<FSCommerceTypes.Category> {
    const updatedQuery = { ...query, levels: 2 };
    let _qs = qs.stringify(updatedQuery);
    _qs = _qs ? '?' + _qs : '';

    const response = await this.client.get<SFCC.Category>(
      `/categories/${(id || 'root')
        .split(',')
        .map(encodeURIComponent)
        .join(',')}` + _qs
    );

    const normalized = demandwareNormalizer.category(response.data);
    return runMiddleware(
      response.data,
      normalized,
      this.middleware.fetchCategory
    );
  }

  /**
   * Fetch information about a product specified by its identifier.
   *
   * @param {string} id - An identifier for a product
   * @returns {Promise.<Product>} A Promise representing normalized metadata about a product
   */
  async fetchProduct(id: string): Promise<FSCommerceTypes.Product> {
    const response = await this.client.get<SFCC.Product>(
      `/products/${encodeURIComponent(id)}?expand=${[
        ...this.productExtraFields,
        'set_products'
      ].join(',')}`
      // TODO: allow user to overwrite extra fields
    );

    const normalized = demandwareNormalizer.product(response.data, this.storeCurrencyCode);

    return runMiddleware(
      response.data,
      normalized,
      this.middleware.fetchProduct
    );
  }

  /**
   * Fetch metadata about a product index resulting from a specified query. A product
   * index is a collection of matching products as well as sorting and filtering options.
   *
   * @param {ProductQuery} query - Options specifying what products to search for
   * @returns {Promise.<ProductIndex>} A Promise representing a normalized product index object
   */
  async fetchProductIndex(
    query: FSCommerceTypes.ProductQuery
  ): Promise<FSCommerceTypes.ProductIndex> {
    const options = demandwareDenormalizer.productQuery(query);

    const response = await this.client.get<SFCC.ProductSearchResult>(`/product_search`, {
      params: options
    });

    if (!response.data.hits || !response.data.hits.length) {
      return demandwareNormalizer.productIndex(response.data, query, this.storeCurrencyCode);
    }

    const products = await this.fetchProducts(
      response.data.hits.map(this.masterToVariantProductId)
    );

    let productIndexData = demandwareNormalizer.productIndex(
      response.data,
      query,
      this.storeCurrencyCode
    );
    productIndexData.products = products;
    productIndexData = await runMiddleware(
      response.data,
      productIndexData,
      this.middleware.fetchProductIndex
    );

    return productIndexData;
  }

  /**
   * Fetch a product index for a specified search keyword or query.
   *
   * @param {string} keyword - A keyword for which matching products should be returned
   * @param {ProductQuery} query - Options specifing which and how many products to be queried
   * @returns {Promise.<ProductIndex>} A Promise representing a product index encapsulating products
   * that match the search terms
   */
  async search(
    keyword: string,
    query?: FSCommerceTypes.ProductQuery
  ): Promise<FSCommerceTypes.ProductIndex> {
    return this.fetchProductIndex({ ...query, keyword });
  }

  /**
   * Fetch suggested brands, categories, and products for a given keyword
   *
   * @param {string} keyword - The specified keyword for which suggested items should be queried
   * @returns {Promise.<SearchSuggestsions>} A Promise representing suggested brands, categories,
   * and products for the specified keyword
   */
  async searchSuggestion(keyword: string): Promise<FSCommerceTypes.SearchSuggestion> {
    const { data } = await this.client.get<SFCC.SuggestionResult>('/search_suggestion', {
      params: { q: keyword }
    });

    return demandwareNormalizer.searchSuggestion(data);
  }
}
