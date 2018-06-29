import { Product } from '../CommerceTypes';

/**
 * Methods to fetch product recommendations from a data source.
 */
export default interface ProductRecommendationDataSource {
  /**
   * Retrieve recommended products for a specified product id.
   *
   * @param {string} id - The id of the product for which recommended products will be retrieved.
   * @returns {Promise.<Array.<Product>>} A promise representing an array of recommended products
   */
  fetchProductRecommendations(id: string): Promise<Product[]>;
}
