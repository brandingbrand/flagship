/**
 * Query to select a group of reviews
 * https://developer.bazaarvoice.com/conversations-api/reference/v5.4/reviews/review-display
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

  /**
   * The Filter parameter for the Bazaarvoice query
   *
   * @example ['ProductId:50', 'Rating:eq:2']
   */
  filter?: string | string[];

  /**
   * The Sort parameter for the Bazaarvoice query
   *
   * @example 'Rating:asc,SubmissionTime:desc'
   */
  sort?: string;
}
