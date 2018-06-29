import { Image } from '../../Commerce/types/Image';
import { ReviewMetadata } from './ReviewMetadata';
import { ReviewContext } from './ReviewContext';
import { ReviewDimension } from './ReviewDimension';

/**
 * A single review
 */
export interface Review extends ReviewMetadata {
  /**
   * Contexts for the review
   */
  context?: ReviewContext[];

  /**
   * Dimensions for the review
   */
  dimensions?: ReviewDimension[];

  /**
   * Photos for the review
   */
  photos?: Image[];

  /**
   * Review rating
   *
   * @example 3.5
   */
  rating: number;

  /**
   * Review title
   *
   * @example "Great Product!"
   */
  title: string;

  /**
   * Does the user recommend the product being reviewd
   */
  isRecommended?: boolean;

  /**
   * Badges for the review
   */
  badges?: ReviewBadge[];

  /**
   * Bottom line (summary) of the review
   */
  bottomLine?: string;

  /**
   * Logo for the review origin
   */
  reviewedAtLogo?: string;
}

/**
 * Badge for a review
 */
export interface ReviewBadge {
  /**
   * Identifier for the badge
   *
   * @example trusted
   */
  id: string;

  /**
   * Type of badge
   *
   * @example "Trusted User"
   */
  badgeType: string;

  /**
   * Content type of the badge
   */
  contentType: string;
}
