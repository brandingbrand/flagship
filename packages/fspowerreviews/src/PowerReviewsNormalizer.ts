import {
  ReviewTypes
} from '@brandingbrand/fscommerce';

function review(prReview: any): ReviewTypes.Review {
  const { brand_base_url, brand_logo_uri } = prReview.details;
  const reviewedAtLogo = brand_base_url && brand_logo_uri
                          ? [brand_base_url, brand_logo_uri].join('')
                          : undefined;

  return {
    title: prReview.details.headline,
    text: prReview.details.comments,
    rating: prReview.metrics.rating,
    user: {
      isStaffReviewer: prReview.badges.is_staff_reviewer,
      isVerifiedBuyer: prReview.badges.is_verified_buyer,
      isVerifiedReviewer: prReview.badges.is_verified_reviewer,
      location: prReview.details.location,
      name: prReview.details.nickname
    },
    created: prReview.details.created_date,
    context: prReview.details.properties.map((property: any) => {
      return {
        id: property.key,
        label: property.label,
        value: property.value
      };
    }),
    photos: [],    // TODO: Parse photos from PR (need example)
    bottomLine: prReview.details.bottom_line,
    reviewedAtLogo
  };
}

function reviewDetails(prResult: any): ReviewTypes.ReviewDetails {
  return {
    id: prResult.page_id,
    reviews: prResult.reviews.map(review),
    statistics: reviewStatistics(prResult),
    name: prResult.rollup.name
  };
}

function reviewSummary(prResult: any): ReviewTypes.ReviewSummary {
  return {
    id: prResult.page_id,
    averageRating: prResult.rollup.average_rating,
    reviewCount: prResult.rollup.review_count
  };
}

function reviewStatistics(prResult: any): ReviewTypes.ReviewStatistics {
  const rollup = prResult.rollup;
  return {
    id: prResult.page_id,
    averageRating: rollup.average_rating,
    reviewCount: rollup.review_count,
    recommendedRatio: rollup.recommended_ratio,
    ratingDistribution: rollup.rating_histogram.map((count: any, key: number) => {
      return {
        value: key + 1,
        count
      };
    }),
    contextDistributions: rollup.properties.map((property: any) => {
      return {
        id: property.key,
        label: property.name,
        values: property.values.map((value: any) => {
          return {
            value: value.label,
            count: value.count
          };
        })
      };
    })
  };
}

export default {
  reviewDetails,
  reviewSummary,
  reviewStatistics
};
