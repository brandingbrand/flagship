export interface WriteReviewCommand {
  actionType: 'Preview' | 'Submit';
  agreedToTermsAndConditions?: boolean;
  campaignId?: string;
  isRecommended?: boolean;
  productId: string;
  rating: number;
  reviewText: string;
  title?: string;
  user?: string;
  userEmail?: string;
  userId?: string;
  userLocation?: string;
  userNickname?: string;

  additionalFields?: Record<string, string>;
  additionalRatings?: Record<string, string>;
  tags?: Record<string, string>;
}
