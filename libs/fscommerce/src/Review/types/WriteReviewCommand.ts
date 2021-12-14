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

  additionalFields?: {
    [key: string]: string;
  };
  additionalRatings?: {
    [key: string]: string;
  };
  tags?: {
    [key: string]: string;
  };
}
