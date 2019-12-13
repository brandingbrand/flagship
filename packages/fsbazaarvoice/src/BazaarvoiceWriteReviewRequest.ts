export interface BazaarvoiceWriteReviewRequest {
  Action: 'Preview' | 'Submit';
  AgreedToTermsAndConditions?: boolean;
  CampaignId?: string;
  fp?: string;
  HostedAuthentication_AuthenticationEmail?: string;
  HostedAuthentication_CallbackUrl?: string;
  IsRecommended?: boolean;
  Locale?: string;
  NetPromoterComment?: string;
  NetPromoterScore?: number;
  ProductId: string;
  Rating: number;
  ReviewText: string;
  SendEmailAlertWhenCommented?: boolean;
  SendEmailAlertWhenPublished?: boolean;
  Title?: string;
  User?: string;
  UserEmail?: string;
  UserId?: string;
  UserLocation?: string;
  UserNickname?: string;
}
