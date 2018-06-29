import { ReviewMetadata } from './ReviewMetadata';

/**
 * Question posed for a product
 */
export interface ReviewQuestion extends ReviewMetadata {
  /**
   * Summary of the question
   */
  summary?: string;

  /**
   * Answers for the question
   */
  answers?: ReviewAnswer[];
}

/**
 * Answer provided for a given review question
 */
export type ReviewAnswer = ReviewMetadata;
