import { ReviewDistribution } from './ReviewDistribution';
import { ReviewContextDistribution } from './ReviewContext';
import { ReviewDimensionAverage } from './ReviewDimension';

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

  /**
   * Ratio of users who recommend this product
   *
   * @example 90
   */
  recommendedRatio?: number;

  /**
   * Distribution of review ratings
   */
  ratingDistribution?: ReviewDistribution[];

  /**
   * Distribution of review contexts
   */
  contextDistributions?: ReviewContextDistribution[];

  /**
   * Averages of review dimensions
   */
  dimensionAverages?: ReviewDimensionAverage[];
}
