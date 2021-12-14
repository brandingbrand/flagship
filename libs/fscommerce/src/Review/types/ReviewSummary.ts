/**
 * Summary of a group of reviews
 */
export interface ReviewSummary {
  /**
   * Identifier for the group of reviews
   */
  id: string;

  /**
   * Average rating for the group of reviews
   *
   * @example 4.2
   */
  averageRating: number;

  /**
   * Count of reviews
   */
  reviewCount: number;
}
