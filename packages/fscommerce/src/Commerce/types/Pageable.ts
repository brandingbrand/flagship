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

  /**
   * A boolean value representing if a list of products has additional results before the
   * current page or cursor.
   *
   * @example true
   */
  hasPrevPage?: boolean;

  /**
   * A boolean value representing if a list of products has additional results beyond the
   * current page or cursor.
   *
   * @example true
   */
  hasNextPage?: boolean;

  /**
   * An identifier used to divide the list into items that fall before or after the
   * current result list. Will usually be the first result's cursor.
   *
   * Used for cursor-based pagination (as opposed to offset-based pagination).
   *
   *  @example eyJsYXN0X2lkIjoxMDA3OTc4ODg3NiwibGFzdF92YWx1ZSI6IjEwMDc5Nzg4ODc2In0=
   */
  prevCursor?: string;

  /**
   * An identifier used to divide the list into items that fall before or after the
   * current result list. Will usually be the last result's cursor.
   *
   * Used for cursor-based pagination (as opposed to offset-based pagination).
   *
   *  @example eyJsYXN0X2lkIjoxMDA3OTc4ODg3NiwibGFzdF92YWx1ZSI6IjEwMDc5Nzg4ODc2In0=
   */
  nextCursor?: string;
}
