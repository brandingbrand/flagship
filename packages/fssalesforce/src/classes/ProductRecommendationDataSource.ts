import { DemandwareBase } from './Base';
import {
  CommerceTypes as FSCommerceTypes,
  ProductRecommendationDataSource
} from '@brandingbrand/fscommerce';

export class DemandwareProductRecommendationDataSource extends DemandwareBase
                                                       implements ProductRecommendationDataSource {

  /**
   * Fetch recommended products for a product specified by its identifier.
   *
   * @param {string} id - An identifier corresponding to a product for which recommendations should
   * be queried
   * @returns {Promise.<Array.<Product>>} A Promise representing an array of recommended products
   */
  async fetchProductRecommendations(id: string): Promise<FSCommerceTypes.Product[]> {
    const response = await this.client.get<SFCC.Product>(`/products/${id}/recommendations`);

    const ids = ((response.data && response.data.recommendations) || [])
      .map(recommendation => recommendation.recommended_item_id)
      .filter((id): id is string => id !== undefined);

    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    return this.fetchProducts(ids);
  }

}
