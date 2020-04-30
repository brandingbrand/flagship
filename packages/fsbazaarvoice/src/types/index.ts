import { ReviewTypes } from '@brandingbrand/fscommerce';

export interface ContextDataValuesType {
  Id: string;
  DimensionLabel: string;
  Value: string | string[];
  ValueLabel: string;
}

export interface SecondaryRatingsType {
  Id?: string;
  Label?: string;
  MinLabel?: string;
  MaxLabel?: string;
  Value?: string;
  ValueLabel?: string;
}

export interface BvReview {
  Id?: string;
  Title: string;
  ReviewText: string;
  Rating: number;
  UserLocation?: string;
  UserNickname?: string;
  IsRecommended?: boolean;
  IsSyndicated?: boolean;
  SyndicationSource?: ReviewTypes.SyndicationSource;
  Badges?: ReviewTypes.ReviewBadge[];
  SubmissionTime?: any;
  ContextDataValues: { [p: string]: ContextDataValuesType };
  SecondaryRatings: { [p: string]: SecondaryRatingsType };
}

export interface ReviewStatisticsType {
  AverageOverallRating: number;
  TotalReviewCount: number;
}

export interface BvProductStatistics {
  ProductId: string;
  ReviewStatistics: ReviewStatisticsType;
}

export interface DistributionType {
  RatingValue: number | string;
  Count: number;
}

export interface ContextDataDistributionValueType {
  Value: number | string;
  Count: number;
}

export interface ContextDataDistributionType {
  Id?: string;
  Label?: string;
  Values: ContextDataDistributionValueType[];
}

export interface SecondaryRatingsAveragesType {
  Id?: string;
  Label?: string;
  MinLabel?: string;
  MaxLabel?: string;
  AverageRating: number;
}

export interface ReviewStatisticsType {
  AverageOverallRating: number;
  RecommendedCount: number;
  NotRecommendedCount: number;
  TotalReviewCount: number;
  RatingDistribution: DistributionType[];
  ContextDataDistribution: { [p: string]: ContextDataDistributionType };
  SecondaryRatingsAverages: { [p: string]: SecondaryRatingsAveragesType };
}

export interface BvProduct {
  Id: string;
  ReviewStatistics: ReviewStatisticsType;
}

export interface ResultsType {
  Id?: string;
  UserLocation?: string;
  UserNickname?: string;
  QuestionDetails?: string;
  QuestionSummary?: string;
  AnswerIds: number[];
  TotalFeedbackCount: number;
  TotalPositiveFeedbackCount: number;
  TotalNegativeFeedbackCount: number;
  SubmissionTime: any;
}

export interface AnswerType {
  Id?: string;
  UserLocation?: string;
  UserNickname?: string;
  AnswerText?: string;
  TotalFeedbackCount: number;
  TotalPositiveFeedbackCount: number;
  TotalNegativeFeedbackCount: number;
  SubmissionTime: any;
}

export interface AnswersType {
  Answers: AnswerType[];
}

export interface BvResults {
  Results: ResultsType[];
  Includes: AnswersType;
}

export interface ErrorsType {
  Message: string;
  Code?: string;
}

export interface ReviewType {
  Rating: number;
  Title: string;
  isRecommended?: boolean;
  SubmissionTime?: any;
  ReviewText?: string;
}

export interface BvWriteReview {
  Review?: ReviewType;
  HasErrors: boolean;
  SubmissionId: string;
  TypicalHoursToPost?: number;
  Errors: ErrorsType[];
}
