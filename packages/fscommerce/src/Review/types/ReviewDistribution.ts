/**
 * Frequency of a value in a distribution
 */
export interface ReviewDistribution {
  /**
   * Value in the distribution
   *
   * @example 2
   */
  value: number | string;

  /**
   * Frequency of review values matching distribution value
   *
   * @example 22
   */
  count: number;
}
