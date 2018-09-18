import {
  ReviewTypes
} from '@brandingbrand/fscommerce';

export function review(bvReview: any): ReviewTypes.Review {
  return {
    id: bvReview.ProductId,
    title: bvReview.Title,
    text: bvReview.ReviewText,
    rating: bvReview.Rating,
    user: user(bvReview),
    isRecommended: bvReview.IsRecommended,
    badges: bvReview.Badges,
    created: bvReview.SubmissionTime,
    context: Object.keys(bvReview.ContextDataValues).map(key => {
      const context = bvReview.ContextDataValues[key];
      return {
        id: context.Id,
        label: context.DimensionLabel,
        value: context.Value,
        valueLabel: context.ValueLabel
      };
    }),
    dimensions: Object.keys(bvReview.SecondaryRatings).map(key => {
      const dimension = bvReview.SecondaryRatings[key];
      return {
        id: dimension.Id,
        label: dimension.Label,
        minLabel: dimension.MinLabel,
        maxLabel: dimension.MaxLabel,
        value: dimension.Value,
        valueLabel: dimension.ValueLabel
      };
    }),
    photos: []    // TODO: Parse photos from BV (need example)
  };
}

export function reviewSummary(bvProductStatistics: any): ReviewTypes.ReviewSummary {
  return {
    id: bvProductStatistics.ProductId,
    averageRating: bvProductStatistics.ReviewStatistics.AverageOverallRating,
    reviewCount: bvProductStatistics.ReviewStatistics.TotalReviewCount
  };
}

export function reviewStatistics(bvProduct: any): ReviewTypes.ReviewStatistics {
  const bvStats = bvProduct.ReviewStatistics;
  return {
    id: bvProduct.Id,
    averageRating: bvStats.AverageOverallRating,
    reviewCount: bvStats.TotalReviewCount,
    ratingDistribution: bvStats.RatingDistribution.map((distribution: any) => {
      return {
        value: distribution.RatingValue,
        count: distribution.Count
      };
    }),
    contextDistributions: Object.keys(bvStats.ContextDataDistribution).map(key => {
      const context = bvStats.ContextDataDistribution[key];
      return {
        id: context.Id,
        label: context.Label,
        values: context.Values.map((distribution: any) => {
          return {
            value: distribution.Value,
            count: distribution.Count
          };
        })
      };
    }),
    dimensionAverages: Object.keys(bvStats.SecondaryRatingsAverages).map(key => {
      const dimension = bvStats.SecondaryRatingsAverages[key];
      return {
        id: dimension.Id,
        label: dimension.Label,
        minLabel: dimension.MinLabel,
        maxLabel: dimension.MaxLabel,
        averageRating: dimension.AverageRating
      };
    })
  };
}

export function questions(bvResults: any): ReviewTypes.ReviewQuestion[] {
  return bvResults.Results.map((question: any) => {
    return {
      id: question.Id,
      user: user(question),
      text: question.QuestionDetails,
      summary: question.QuestionSummary,
      answers: question.AnswerIds.map((answerId: any) => {
        return answer(bvResults.Includes.Answers[answerId]);
      }),
      feedback: {
        total: question.TotalFeedbackCount,
        positive: question.TotalPositiveFeedbackCount,
        negative: question.TotalNegativeFeedbackCount
      },
      created: question.SubmissionTime
    };
  });
}

export function answer(bvAnswer: any): ReviewTypes.ReviewAnswer {
  return {
    id: bvAnswer.Id,
    user: user(bvAnswer),
    text: bvAnswer.AnswerText,
    feedback: {
      total: bvAnswer.TotalFeedbackCount,
      positive: bvAnswer.TotalPositiveFeedbackCount,
      negative: bvAnswer.TotalNegativeFeedbackCount
    },
    created: bvAnswer.SubmissionTime
  };
}

function user(bvReview: any): ReviewTypes.ReviewUser {
  return {
    location: bvReview.UserLocation ? bvReview.UserLocation : undefined,
    name: bvReview.UserNickname
  };
}
