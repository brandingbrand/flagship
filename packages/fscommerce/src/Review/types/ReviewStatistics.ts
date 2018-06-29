import { ReviewSummary } from './ReviewSummary';
import { ReviewDistribution } from './ReviewDistribution';
import { ReviewContextDistribution } from './ReviewContext';
import { ReviewDimensionAverage } from './ReviewDimension';

/**
 * Statistics for a group of reviews
 */
export interface ReviewStatistics extends ReviewSummary {
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
