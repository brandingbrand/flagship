import FSNetwork from '@brandingbrand/fsnetwork';
import {
  AbstractReviewDataSource,
  ReviewDataSource,
  ReviewTypes
} from '@brandingbrand/fscommerce';
import TurnToNormalizer from './TurnToNormalizer';

export interface TurnToConfig {
  endpoint: string;
  key: string;
  version?: string;
}

export class TurnToDataSource extends AbstractReviewDataSource implements ReviewDataSource {
  client: FSNetwork;

  constructor(config: TurnToConfig) {
    super();
    this.client = new FSNetwork({
      baseURL: config.endpoint + (config.version || 'v1.1/'),
      headers: {
        Authorization: 'Bearer ' + config.key
      }
    });
  }

  async fetchReviewDetails(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewDetails[]> {
    const id = Array.isArray(query.ids) ? query.ids[0] : query.ids;

    return this.client.get('/reviews', {
      params: {
        sku: id
      }
    }).then(({ data }) => {
      return [{
        id,
        reviews: data.reviews.map(TurnToNormalizer.review)
      }];
    });
  }

  async fetchReviewSummary(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewSummary[]> {
    const ids = Array.isArray(query.ids) ? query.ids.join(',') : query.ids;

    return this.client.get('/products/ugc_summary', {
      params: {
        sku: ids
      }
    }).then(({ data }) => data.map(TurnToNormalizer.reviewSummary));
  }

  async fetchReviewStatistics(
    query: ReviewTypes.ReviewQuery
  ): Promise<ReviewTypes.ReviewStatistics[]> {
    const ids = Array.isArray(query.ids) ? query.ids.join(',') : query.ids;

    return this.client.get('/products/ugc_summary', {
      params: {
        sku: ids
      }
    }).then(({ data }) => data.map(TurnToNormalizer.reviewStatistics));
  }
}
