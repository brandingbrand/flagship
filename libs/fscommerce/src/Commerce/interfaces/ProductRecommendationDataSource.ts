import type { Product } from '../CommerceTypes';

/**
 * Methods to fetch product recommendations from a data source.
 */
export default interface ProductRecommendationDataSource {
  /**
   * Retrieve recommended products for a specified product id.
   *
   * @param id - The id of the product for which recommended products will be retrieved.
   * @return A promise representing an array of recommended products
   */
  fetchProductRecommendations: (id: string) => Promise<Product[]>;
}
