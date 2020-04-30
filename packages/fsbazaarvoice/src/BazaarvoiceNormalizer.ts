import {
  ReviewTypes
} from '@brandingbrand/fscommerce';
import {
  AnswerType,
  BvProduct,
  BvProductStatistics,
  BvResults,
  BvReview, BvWriteReview,
  ContextDataDistributionValueType,
  DistributionType, ErrorsType, ResultsType
} from './types';

export function review(bvReview: BvReview): ReviewTypes.Review {
  return {
    id: bvReview.Id,
    title: bvReview.Title,
    text: bvReview.ReviewText,
    rating: bvReview.Rating,
    user: user(bvReview),
    isRecommended: bvReview.IsRecommended,
    isSyndicated: bvReview.IsSyndicated,
    syndicationSource: bvReview.SyndicationSource,
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

export function reviewSummary(bvProductStatistics: BvProductStatistics): ReviewTypes.ReviewSummary {
  return {
    id: bvProductStatistics.ProductId,
    averageRating: bvProductStatistics.ReviewStatistics.AverageOverallRating,
    reviewCount: bvProductStatistics.ReviewStatistics.TotalReviewCount
  };
}

export function reviewStatistics(bvProduct: BvProduct): ReviewTypes.ReviewStatistics {
  const bvStats = bvProduct.ReviewStatistics;

  const recommendedCount = bvStats.RecommendedCount;
  const nonRecommendedCount = bvStats.NotRecommendedCount;
  const recommendedTotal = recommendedCount + nonRecommendedCount;

  const recommendedRatio = recommendedTotal !== 0 ?
  (recommendedCount / (recommendedTotal)) : 0;

  return {
    id: bvProduct.Id,
    averageRating: bvStats.AverageOverallRating,
    reviewCount: bvStats.TotalReviewCount,
    recommendedRatio,
    ratingDistribution: bvStats.RatingDistribution.map((distribution: DistributionType) => {
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
        values: context.Values.map((distribution: ContextDataDistributionValueType) => {
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

export function questions(bvResults: BvResults): ReviewTypes.ReviewQuestion[] {
  return bvResults.Results.map((question: ResultsType) => {
    return {
      id: question.Id,
      user: user(question),
      text: question.QuestionDetails,
      summary: question.QuestionSummary,
      answers: question.AnswerIds.map((answerId: number) => {
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

export function answer(bvAnswer: AnswerType): ReviewTypes.ReviewAnswer {
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

function user(bvReview: BvReview | ResultsType | AnswerType): ReviewTypes.ReviewUser {
  return {
    location: bvReview.UserLocation ? bvReview.UserLocation : undefined,
    name: bvReview.UserNickname
  };
}

export function writeReview(bvWriteReview: BvWriteReview): ReviewTypes.WriteReviewSubmission {
  const { Review, HasErrors } = bvWriteReview;

  if (!Review && !HasErrors) {
    throw new Error('Incorect write review response type.');
  }

  return {
    review: Review && {
      rating: Review.Rating,
      title: Review.Title,
      isRecommended: Review.isRecommended,
      created: Review.SubmissionTime,
      text: Review.ReviewText
    },
    hasErrors: !!bvWriteReview.HasErrors,
    submissionId: bvWriteReview.SubmissionId || '',
    hoursToPost: bvWriteReview.TypicalHoursToPost,
    errors: bvWriteReview.Errors && bvWriteReview.Errors.length > 0
      ? bvWriteReview.Errors.map((error: ErrorsType) => {
        return {
          message: error.Message || '0',
          code: error.Code
        };
      })
      : []
  };
}
