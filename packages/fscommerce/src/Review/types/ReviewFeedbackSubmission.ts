import { Review } from './Review';

export interface ReviewFeedbackSubmission {
  review?: Review;
  errors: ReviewFeedbackSubmissionError[];
}

export interface ReviewFeedbackSubmissionError {
  message: string;
  code?: string;
}
