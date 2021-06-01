export interface ReviewFeedbackCommand {
  reviewId: string;
  feedbackType: string;
  contentType: string;
  vote: string;
}
