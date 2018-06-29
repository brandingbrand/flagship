import {
  ReviewDetails,
  ReviewQuery,
  ReviewQuestion,
  ReviewStatistics,
  ReviewSummary
} from './ReviewTypes';

// Interface allows for optional methods
interface ReviewDataSource {
  fetchQuestions?(query: ReviewQuery): Promise<ReviewQuestion[]>;
  fetchReviewDetails(query: ReviewQuery): Promise<ReviewDetails[]>;
  fetchReviewSummary(query: ReviewQuery): Promise<ReviewSummary[]>;
  fetchReviewStatistics(query: ReviewQuery): Promise<ReviewStatistics[]>;
}

export default ReviewDataSource;
