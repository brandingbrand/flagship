import { Product } from './CommerceTypes';
import AccountDataSource from './interfaces/AccountDataSource';
import CartDataSource from './interfaces/CartDataSource';
import ProductCatalogDataSource from './interfaces/ProductCatalogDataSource';
import ProductRecommendationDataSource from './interfaces/ProductRecommendationDataSource';
import ProductSearchDataSource from './interfaces/ProductSearchDataSource';

export default interface CommerceDataSource extends AccountDataSource,
                                                    CartDataSource,
                                                    ProductRecommendationDataSource,
                                                    ProductSearchDataSource,
                                                    ProductCatalogDataSource {

  // Minumum number of refinements to expect in product queries. For example, on grid pages,
  // Demandware includes the current category ID as a refinement whereas this won't be the
  // case on scraped APIs.
  minRefinements: number;

  /**
   * Fetch information about multiple products as specified by an array of identifiers.
   *
   * @param {Array.<string>} ids - An array of product identifiers to query
   * @returns {Promise.<Array.<Product>>} A Promise representing an array of product metadata
   */
  fetchProducts?: (ids: string[]) => Promise<Product[]>;
}
