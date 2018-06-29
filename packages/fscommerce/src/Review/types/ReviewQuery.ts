/**
 * Query to select a group of reviews
 */
export interface ReviewQuery {
  /**
   * Identifier(s) of the reviews to be queried
   */
  ids: string | string[];

  /**
   * Page of results
   *
   * @example 2
   */
  page?: number;

  /**
   * Maximum number of results per page
   *
   * @example 10
   */
  limit?: number;
}
