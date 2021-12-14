/**
 * Metadata for a review dimension
 */
export interface ReviewDimensionMetadata {
  /**
   * Identifier for the dimension
   *
   * @example Fit_22
   */
  id?: string;

  /**
   * Label for the dimension
   *
   * @example Fit
   */
  label?: string;

  /**
   * Minimum label for the dimension
   *
   * @example Too small
   */
  minLabel?: string;

  /**
   * Maximum label for the dimension
   *
   * @example Too big
   */
  maxLabel?: string;
}


/**
 * Review Dimension
 */
export interface ReviewDimension extends ReviewDimensionMetadata {
  /**
   * Value of the dimension
   *
   * @example 3
   */
  value?: string;

  /**
   * Label for the dimension value
   *
   * @example True to size
   */
  valueLabel?: string;
}

/**
 * Average of a review dimension
 */
export interface ReviewDimensionAverage extends ReviewDimensionMetadata {
  /**
   * Average value of a review dimension
   *
   * @example 4.2
   */
  averageRating: number;
}
