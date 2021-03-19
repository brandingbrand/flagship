export default interface Pageable {
  /**
   * The page number of the products if more products exist for an index than are
   * returned by a single query.
   *
   * @example 3
   */
  page: number;

  /**
   * The maximum number of products to be returned by a single query.
   *
   * @example 10
   */
  limit: number;

  /**
   * The page number of the first page of products if the data represents a range of pages
   *
   * @example 3
   */
  minPage?: number;

}
