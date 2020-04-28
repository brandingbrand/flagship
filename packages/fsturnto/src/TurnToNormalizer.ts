import {
  ReviewTypes
} from '@brandingbrand/fscommerce';

export interface ReviewUser {
  isStaffReviewer?: boolean;
  isVerifiedBuyer?: boolean;
  isVerifiedReviewer?: boolean;
  location?: string;
  name?: string;
}

export interface DimensionReview {
  dimensionId: string;
  dimensionLabel: string;
  value: string;
  label: string;
}
export interface DimensionSummary {
  id: string;
  label: string;
  average: number;
}

export interface TTReview {
  title: string;
  text?: string;
  rating: number;
  user: {
    nickName: ReviewUser;
  };
  dateCreated: string;
  dimensions: DimensionReview[];
  photos: [];
}

export interface TTSummary {
  sku: string;
  averageRating: number;
  reviews: number;
  ratingBreakdown: {[key: string] : number};
  dimensions: DimensionSummary[];
}

function review<T extends TTReview>(ttReview: T): ReviewTypes.Review {
  return {
    title: ttReview.title,
    text: ttReview.text,
    rating: ttReview.rating,
    user: ttReview.user.nickName,
    created: ttReview.dateCreated,
    dimensions: ttReview.dimensions.map(<T extends DimensionReview>(dimension: T) => {
      return {
        id: dimension.dimensionId,
        label: dimension.dimensionLabel,
        value: dimension.value,
        valueLabel: dimension.label
      };
    }),
    photos: []    // TODO: Parse photos from TT (need example)
  };
}

function reviewSummary<T extends TTSummary>(ttSummary: T): ReviewTypes.ReviewSummary {
  return {
    id: ttSummary.sku,
    averageRating: ttSummary.averageRating,
    reviewCount: ttSummary.reviews
  };
}

function reviewStatistics<T extends TTSummary>(ttSummary: T): ReviewTypes.ReviewStatistics {
  return {
    id: ttSummary.sku,
    averageRating: ttSummary.averageRating,
    reviewCount: ttSummary.reviews,
    ratingDistribution: Object.keys(ttSummary.ratingBreakdown).map(key => {
      return {
        value: key,
        count: ttSummary.ratingBreakdown[key]
      };
    }),
    dimensionAverages: ttSummary.dimensions
      .filter(<T extends DimensionSummary>(dimension: T) => dimension.average !== null)
      .map(<T extends DimensionSummary>(dimension: T) => {
        return {
          id: dimension.id,
          label: dimension.label,
          averageRating: dimension.average
        };
      })
  };
}

export default {
  review,
  reviewSummary,
  reviewStatistics
};
