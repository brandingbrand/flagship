import { Review } from './Review';
import { ReviewSummary } from './ReviewSummary';

/**
 * Details for a group of reviews
 */
export interface ReviewDetails {
  /**
   * Identifier for the group of reviews
   */
  id: string;

  /**
   * Reviews
   */
  reviews: Review[];

  /**
   * Summary of the group of reviews
   */
  summary?: ReviewSummary;

  /**
   * Page of reviews
   *
   * @example 2
   */
  page?: number;

  /**
   * Maximum number of reviews in a single details
   *
   * @example 10
   */
  limit?: number;

  /**
   * Total number of reviews for this identifier
   *
   * @example 99
   */
  total?: number;

  /**
   * Name of product being reviewed
   *
   * @example Yellow plate
   */
  name?: string;
}
