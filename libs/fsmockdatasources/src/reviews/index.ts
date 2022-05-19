import type { ReviewDataSource, ReviewTypes } from '@brandingbrand/fscommerce';
import { AbstractReviewDataSource } from '@brandingbrand/fscommerce';

import { Questions, Reviews } from '../helpers';

export class MockDataSource extends AbstractReviewDataSource implements ReviewDataSource {
  public async fetchReviewDetails(
    query: ReviewTypes.ReviewQuery
  ): Promise<ReviewTypes.ReviewDetails[]> {
    const { limit, page = 1 } = query;
    const pageIndex = page - 1;
    const startIndex = limit ? pageIndex * limit : 0;
    const endIndex = limit ? startIndex + limit : undefined;

    const ids = Array.isArray(query.ids) ? query.ids : [query.ids];
    const summaries = await this.fetchReviewSummary(query);
    const statistics = await this.fetchReviewStatistics(query);

    return ids.map((id) => {
      const allReviews = Reviews[id] || [];
      const reviews = allReviews.slice(startIndex, endIndex);

      return {
        id,
        reviews,
        statistics: statistics.find((stats) => stats.id === id),
        summaries: summaries.find((summary) => summary.id === id),
        page,
        limit,
        total: allReviews.length,
      };
    });
  }

  public async fetchReviewSummary(
    query: ReviewTypes.ReviewQuery
  ): Promise<ReviewTypes.ReviewSummary[]> {
    const stats = await this.fetchReviewStatistics(query);
    return stats.map(({ averageRating, id, reviewCount }) => ({ id, averageRating, reviewCount }));
  }

  public async fetchReviewStatistics(
    query: ReviewTypes.ReviewQuery
  ): Promise<ReviewTypes.ReviewStatistics[]> {
    const initialDistribution: Record<string, number> = {};

    const defaultSummary = {
      recommendations: 0,
      ratings: 0,
      distribution: initialDistribution,
    };

    const ids = Array.isArray(query.ids) ? query.ids : [query.ids];
    return ids
      .filter((id) => Reviews[id]?.length)
      .map((id) => {
        const count = Reviews[id]?.length ?? 0;
        const { distribution, ratings, recommendations } =
          Reviews[id]?.reduce((stats, review) => {
            const { rating } = review;
            if (stats.distribution[rating] === undefined) {
              stats.distribution[rating] = 0;
            }

            stats.distribution[rating] += 1;
            stats.recommendations += review.isRecommended ? 1 : 0;
            stats.ratings += rating;

            return stats;
          }, defaultSummary) ?? defaultSummary;

        const stats: ReviewTypes.ReviewStatistics = {
          id,
          recommendedRatio: recommendations / count,
          averageRating: ratings / count,
          reviewCount: count,
          ratingDistribution: Object.keys(distribution).map((key) => ({
            value: key,
            count: distribution[key] ?? 0,
          })),
        };

        return stats;
      });
  }

  public async fetchQuestions(
    query: ReviewTypes.ReviewQuery
  ): Promise<ReviewTypes.ReviewQuestion[]> {
    const ids = Array.isArray(query.ids) ? query.ids : [query.ids];

    return (
      ids
        .map((id) => Questions[id])
        .reduce((all, current) => [...(all ?? []), ...(current ?? [])], []) ?? []
    );
  }

  public async writeReview(
    command: ReviewTypes.WriteReviewCommand
  ): Promise<ReviewTypes.WriteReviewSubmission> {
    throw new Error('Not implemented');
  }
}
