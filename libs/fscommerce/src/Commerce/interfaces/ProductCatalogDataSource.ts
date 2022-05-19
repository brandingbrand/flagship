import type {
  Category,
  CategoryQuery,
  Product,
  ProductIndex,
  ProductQuery,
} from '../CommerceTypes';
import type { ProductPromotion } from '../types/ProductPromotion';

/**
 * Methods to request product and/or category metadata from a data source.
 */
export default interface ProductCatalogDataSource {
  /**
   * Fetch a single product via an id.
   *
   * @param id - The id of the product to fetch
   * @return A promise representing a product matching the id
   */
  fetchProduct: (id: string) => Promise<Product>;

  /**
   * Fetch a product index by means of a product query.
   *
   * @param query - The query for which matching products will be returned
   * @return A promise representing a product index
   */
  fetchProductIndex: (query: ProductQuery) => Promise<ProductIndex>;

  /**
   * Fetch a category via a category id or category query.
   *
   * @param id - An id by which an associated category will be returned
   * @param query - A query describing the category to be returned
   * @return A promise representing a category corresponding to id
   */
  fetchCategory: (id?: string, query?: CategoryQuery) => Promise<Category>;

  /**
   * Fetch information about a promotion
   *
   * @param id - A promotion identifier to query
   * @return A Promise representing a product's promotion metadata
   */
  fetchProductPromotion?: (id: string) => Promise<ProductPromotion>;
}
