import { ProductIndex, ProductQuery, SearchSuggestion } from '../CommerceTypes';

/**
 * Methods to interact with product searches from a data source.
 */
export default interface ProductSearchDataSource {
  /**
   * Query the data source for products matching a specified keyword or query.
   *
   * @param {string} keyword - A keyword by which products will be queried
   * @param {ProductQuery} [query] - A query object by which products will be queried
   * @returns {Promise.<ProductIndex>} A Promise representing a product index
   */
  search(keyword: string, query?: ProductQuery): Promise<ProductIndex>;

  /**
   * Return suggested search terms given a specified keyword.
   *
   * @param {string} keyword - The keyword for which suggested terms will be returned.
   * @returns {Promise.<SearchSuggestion>} A Promise representing the suggested search terms
   */
  searchSuggestion(keyword: string): Promise<SearchSuggestion>;
}
