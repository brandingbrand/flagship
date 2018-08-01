import FSNetwork from '@brandingbrand/fsnetwork';
import {
  AbstractReviewDataSource,
  ReviewDataSource,
  ReviewTypes
} from '@brandingbrand/fscommerce';
import PowerReviewsNormalizer from './PowerReviewsNormalizer';

export interface PowerReviewsConfig {
  endpoint: string;
  apikey: string;
  merchantId: string;
  locale?: string;
}

export class PowerReviewsDataSource extends AbstractReviewDataSource implements ReviewDataSource {
  client: FSNetwork;

  constructor(config: PowerReviewsConfig) {
    super();
    this.client = new FSNetwork({
      baseURL: config.endpoint +
        'm/' + config.merchantId +
        '/l/' + (config.locale || 'en_US') + '/',
      params: {
        apikey: config.apikey
      }
    });
  }

  async fetchReviewDetails(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewDetails[]> {
    const id = Array.isArray(query.ids) ? query.ids[0] : query.ids;

    return this.client.get('/product/' + id + '/reviews')
      .then(({ data }) => data.results.map(PowerReviewsNormalizer.reviewDetails));
  }

  async fetchReviewSummary(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewSummary[]> {
    const ids = Array.isArray(query.ids) ? query.ids.join(',') : query.ids;

    return this.client.get('/product/' + ids + '/snippet')
      .then(({ data }) => data.results.map(PowerReviewsNormalizer.reviewSummary));
  }

  async fetchReviewStatistics(
    query: ReviewTypes.ReviewQuery
  ): Promise<ReviewTypes.ReviewStatistics[]> {
    const id = Array.isArray(query.ids) ? query.ids[0] : query.ids;

    return this.client.get('/product/' + id + '/reviews')
      .then(({ data }) => data.results.map(PowerReviewsNormalizer.reviewStatistics));
  }
}
