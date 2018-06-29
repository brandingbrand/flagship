import FSNetwork from '@brandingbrand/fsnetwork';
import {
  ReviewDataSource,
  ReviewTypes
} from '@brandingbrand/fscommerce';
import * as BazaarvoiceNormalizer from './BazaarvoiceNormalizer';

export interface BazaarvoiceConfig {
  endpoint: string;
  passkey: string;
  apiversion?: string;
}

export class BazaarvoiceDataSource implements ReviewDataSource {
  private client: FSNetwork;

  constructor(config: BazaarvoiceConfig) {
    this.client = new FSNetwork({
      baseURL: config.endpoint,
      params: {
        apiversion: config.apiversion || '5.4',
        passkey: config.passkey
      }
    });
  }

  async fetchReviewDetails(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewDetails[]> {
    const id = Array.isArray(query.ids) ? query.ids[0] : query.ids;
    const params: any = {
      Filter: `ProductId:${id}`,
      Include: 'Products',
      Stats: 'Reviews',
      Limit: query.limit || 10
    };

    if (query.page) {
      params.Offset = params.Limit * (query.page - 1);
    }

    return this.client.get('/data/reviews.json', { params })
      .then(({ data }) => {
        return [{
          id,
          reviews: data.Results.map(BazaarvoiceNormalizer.review),
          statistics: BazaarvoiceNormalizer.reviewStatistics(data.Includes.Products[id]),
          page: (data.Offset / data.Limit) + 1,
          limit: data.Limit,
          total: data.TotalResults
        }];
      });
  }

  async fetchReviewSummary(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewSummary[]> {
    const filter = Array.isArray(query.ids) ?
      query.ids.map(id => `ProductId:${id}`) :
      `ProductId:${query.ids}`;

    return this.client.get('/data/statistics.json', {
      params: {
        Filter: filter,
        Stats: 'Reviews'
      }
    }).then(({ data }) => {
      return data.Results.map(
        (data: any) => BazaarvoiceNormalizer.reviewSummary(data.ProductStatistics)
      );
    });
  }

  async fetchReviewStatistics(
    query: ReviewTypes.ReviewQuery
  ): Promise<ReviewTypes.ReviewStatistics[]> {
    const filter = Array.isArray(query.ids) ? query.ids.map(id => 'id:' + id) : 'id:' + query.ids;

    return this.client.get('/data/products.json', {
      params: {
        Filter: filter,
        Stats: 'Reviews'
      }
    }).then(({ data }) => {
      return data.Results.map(BazaarvoiceNormalizer.reviewStatistics);
    });
  }

  async fetchQuestions(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewQuestion[]> {
    const id = Array.isArray(query.ids) ? query.ids[0] : query.ids;

    return this.client.get('/data/questions.json', {
      params: {
        Filter: `ProductId:${id}`,
        Include: 'Answers'
      }
    }).then(({ data }) => {
      return BazaarvoiceNormalizer.questions(data);
    });
  }
}
