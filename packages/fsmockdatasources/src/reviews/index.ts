import {
  AbstractReviewDataSource,
  ReviewDataSource,
  ReviewTypes
} from '@brandingbrand/fscommerce';
import { Questions, Reviews } from '../helpers';

export class MockDataSource extends AbstractReviewDataSource implements ReviewDataSource {
  async fetchReviewDetails(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewDetails[]> {
    const { page = 1, limit } = query;
    const pageIndex = page - 1;
    const startIndex = limit ? pageIndex * limit : 0;
    const endIndex = limit ? startIndex + limit : undefined;

    const ids = Array.isArray(query.ids) ? query.ids : [query.ids];
    const summaries = await this.fetchReviewSummary(query);
    const statistics = await this.fetchReviewStatistics(query);

    return ids.map(id => {
      const allReviews = Reviews[id] || [];
      const reviews = allReviews.slice(startIndex, endIndex);

      return {
        id,
        reviews,
        statistics: statistics.find(stats => stats.id === id),
        summaries: summaries.find(summary => summary.id === id),
        page,
        limit,
        total: allReviews.length
      };
    });
  }

  async fetchReviewSummary(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewSummary[]> {
    const stats = await this.fetchReviewStatistics(query);
    return stats.map(({ id, averageRating, reviewCount }) => ({ id, averageRating, reviewCount }));
  }

  async fetchReviewStatistics(
    query: ReviewTypes.ReviewQuery
  ): Promise<ReviewTypes.ReviewStatistics[]> {
    const ids = Array.isArray(query.ids) ? query.ids : [query.ids];
    const summaries = ids
      .filter(id => Reviews[id] && Reviews[id].length)
      .map(id => {
        const count = Reviews[id].length;
        const {
          recommendations,
          ratings,
          distribution
        } = Reviews[id].reduce((stats, review) => {
          const { rating } = review;
          if (stats.distribution[rating] === undefined) {
            stats.distribution[rating] = 0;
          }

          stats.distribution[rating] += 1;
          stats.recommendations += review.isRecommended ? 1 : 0;
          stats.ratings += rating;

          return stats;
        }, {
          recommendations: 0,
          ratings: 0,
          distribution: {} as any
        });


        const stats: ReviewTypes.ReviewStatistics = {
          id,
          recommendedRatio: recommendations / count,
          averageRating: ratings / count,
          reviewCount: count,
          ratingDistribution: Object.keys(distribution).map(key => ({
            value: key,
            count: distribution[key]
          }))
        };

        return stats;
      });

    return summaries;
  }

  async fetchQuestions(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewQuestion[]> {
    const ids = Array.isArray(query.ids) ? query.ids : [query.ids];

    return ids.map(id => Questions[id]).reduce((all, current) => [...all, ...current], []);
  }
}
