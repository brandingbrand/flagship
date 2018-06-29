/**
 * Metadata for a review
 */
export interface ReviewMetadata {
  /**
   * Identifier for the review
   */
  id?: string;

  /**
   * User who created the review
   */
  user?: ReviewUser;

  /**
   * Text of the review
   */
  text?: string;

  /**
   * Feedback for the review
   */
  feedback?: ReviewFeedback;

  /**
   * Creation date and time of the review
   */
  created?: any;  // TODO: date interface
}

/**
 * Review user
 */
export interface ReviewUser {
  /**
   * Is this user a staff reviewer
   */
  isStaffReviewer?: boolean;

  /**
   * Is this user a verified buyer
   */
  isVerifiedBuyer?: boolean;

  /**
   * Is this user a verified reviewer
   */
  isVerifiedReviewer?: boolean;

  /**
   * User location
   */
  location?: string;

  /**
   * User name
   */
  name?: string;
}

/**
 * Frequency of positive and negative review feedback
 */
export interface ReviewFeedback {
  /**
   * Total count of feedback
   *
   * @example 20
   */
  total: number;

  /**
   * Count of positive feedback
   *
   * @example 14
   */
  positive: number;

  /**
   * Count of negative feedback
   *
   * @example 6
   */
  negative: number;
}
