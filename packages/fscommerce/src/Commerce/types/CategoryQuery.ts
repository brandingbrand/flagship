/**
 * Interface prescribing supported options for fetching category data.
 */
export interface CategoryQuery {
  /**
   * An identifier for a category.
   *
   * @example '1351413'
   */
  id?: string;

  /**
   * The maximum number of categories to return for a query.
   *
   * @example 10
   */
  limit?: number;

  /**
   * The page number of category results to return when querying paginated data.
   *
   * @example 2
   */
  page?: number;

  /**
   * Specifies how many levels of nested subcategories you want the server to return.
   * The default value is 2.
   *
   * @example 3
   */
  levels?: number;
}
