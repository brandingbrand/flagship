import { ReviewDistribution } from './ReviewDistribution';

/**
 * Review context
 */
export interface ReviewContext {
  /**
   * Identifier for the context
   *
   * @example Age_12
   */
  id?: string;

  /**
   * Label for the context
   *
   * @example Age
   */
  label?: string;

  /**
   * Value for the context
   *
   * @example 18to24
   */
  value?: string | string[];

  /**
   * Label for the context value
   *
   * @example "18 to 24"
   */
  valueLabel?: string;
}

/**
 * Distribution of a review context
 */
export interface ReviewContextDistribution extends ReviewContext {
  /**
   * Values of the context distribution
   */
  values: ReviewDistribution[];
}
