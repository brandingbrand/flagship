import {
  ReviewTypes
} from '@brandingbrand/fscommerce';

function review(ttReview: any): ReviewTypes.Review {
  return {
    title: ttReview.title,
    text: ttReview.text,
    rating: ttReview.rating,
    user: ttReview.user.nickName,
    created: ttReview.dateCreated,
    dimensions: ttReview.dimensions.map((dimension: any) => {
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

function reviewSummary(ttSummary: any): ReviewTypes.ReviewSummary {
  return {
    id: ttSummary.sku,
    averageRating: ttSummary.averageRating,
    reviewCount: ttSummary.reviews
  };
}

function reviewStatistics(ttSummary: any): ReviewTypes.ReviewStatistics {
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
      .filter((dimension: any) => dimension.average !== null)
      .map((dimension: any) => {
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
