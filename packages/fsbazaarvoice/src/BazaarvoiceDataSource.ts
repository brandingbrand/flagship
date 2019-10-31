import FSNetwork from '@brandingbrand/fsnetwork';
import {
  AbstractReviewDataSource,
  ReviewDataSource,
  ReviewTypes
} from '@brandingbrand/fscommerce';
import * as BazaarvoiceNormalizer from './BazaarvoiceNormalizer';
import { BazaarvoiceReviewRequest } from './BazaarvoiceReviewRequest';

export interface BazaarvoiceConfig {
  endpoint: string;
  passkey: string;
  apiversion?: string;
}

export class BazaarvoiceDataSource extends AbstractReviewDataSource implements ReviewDataSource {
  private client: FSNetwork;

  constructor(config: BazaarvoiceConfig) {
    super();

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
    const params: BazaarvoiceReviewRequest = {
      Filter: `ProductId:${id}`,
      Include: 'Products',
      Stats: 'Reviews',
      Limit: query.limit || 10
    };

    if (query.page) {
      params.Offset = params.Limit * (query.page - 1);
    }

    const { data } = await this.client.get('/data/reviews.json', { params });

    return [{
      id,
      reviews: data.Results.map(BazaarvoiceNormalizer.review),
      summary: data.Includes && data.Includes.Products && data.Includes.Products[id] ?
        BazaarvoiceNormalizer.reviewSummary(data.Includes.Products[id])
        : undefined,
      page: (data.Offset / data.Limit) + 1,
      limit: data.Limit,
      total: data.TotalResults
    }];
  }

  async fetchReviewSummary(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewSummary[]> {
    const { data } = await this.client.get('/data/statistics.json', {
      params: {
        Filter: `ProductId:${query.ids}`,
        Stats: 'Reviews'
      }
    });

    return data.Results.map(
      (data: any) => BazaarvoiceNormalizer.reviewSummary(data.ProductStatistics)
    );
  }

  async fetchQuestions(query: ReviewTypes.ReviewQuery): Promise<ReviewTypes.ReviewQuestion[]> {
    const id = Array.isArray(query.ids) ? query.ids[0] : query.ids;

    const { data } = await this.client.get('/data/questions.json', {
      params: {
        Filter: `ProductId:${id}`,
        Include: 'Answers'
      }
    });

    return BazaarvoiceNormalizer.questions(data);
  }
}
