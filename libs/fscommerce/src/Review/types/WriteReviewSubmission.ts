import { Review } from './Review';

export interface WriteReviewSubmission {
  review?: Review;
  hasErrors: boolean;
  submissionId: string;
  hoursToPost?: number;
  locale?: string;
  errors: WriteReviewSubmissionError[];
}

export interface WriteReviewSubmissionError {
  message: string;
  code?: string;
}
