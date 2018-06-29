import {
  Category,
  CategoryQuery,
  Product,
  ProductIndex,
  ProductQuery
} from '../CommerceTypes';

/**
 * Methods to request product and/or category metadata from a data source.
 */
export default interface ProductCatalogDataSource {
  /**
   * Fetch a single product via an id.
   *
   * @param {string} id - The id of the product to fetch
   * @returns {Promise.<Product>} A promise representing a product matching the id
   */
  fetchProduct(id: string): Promise<Product>;

  /**
   * Fetch a product index by means of a product query.
   *
   * @param {ProductQuery} query - The query for which matching products will be returned
   * @returns {Promise.<ProductQuery>} A promise representing a product index
   */
  fetchProductIndex(query: ProductQuery): Promise<ProductIndex>;

  /**
   * Fetch a category via a category id or category query.
   *
   * @param {string} [id] - An id by which an associated category will be returned
   * @param {CategoryQuery} [query] - A query describing the category to be returned
   * @returns {Promise.<Category>} A promise representing a category corresponding to id
   */
  fetchCategory(id?: string, query?: CategoryQuery): Promise<Category>;
}
