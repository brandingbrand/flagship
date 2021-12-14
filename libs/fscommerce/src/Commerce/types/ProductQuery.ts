import Pageable from './Pageable';

/**
 * Interface prescribing options available when fetching products.
 */
export interface ProductQuery extends Partial<Pageable> {
  /**
   * An identifier corresponding to a category for which related products should be returned.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  categoryId?: string;

  /**
   * An array of product identifiers for which product data should be provided.
   *
   * @example ['bcs5vaOjgEQ9Uaaadk9zQIrXE6']
   */
  productIds?: string[];

  /**
   * An array of tags for which related products should be returned.
   *
   * @example ['balloon']
   */
  tags?: string[];

  /**
   * A product handle for which product data should be returned
   *
   * @example 'big-red-balloon'
   */
  handle?: string;

  /**
   * A key representing the type of sort to be applied to the product query. The possible
   * values are dependent on the data source and are typically described in a ProductIndex.
   *
   * @example 'price-high-to-low'
   */
  sortBy?: string;

  /**
   * A keyword for which matching products should be returned. This is typically used for
   * product searches.
   *
   * @example 'big red balloon'
   */
  keyword?: string;

  /**
   * IDs of refinements and corresponding values to filter the product results. These identifers
   * are dependent on the data source and are typically described in a ProductIndex.
   *
   * @example {
   *  'cgid': ['womens']
   * }
   */
  refinements?: Record<string, string[]>;

}
