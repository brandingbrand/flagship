import type { Product } from './CommerceTypes';
import type AccountDataSource from './interfaces/AccountDataSource';
import type CartDataSource from './interfaces/CartDataSource';
import type ContentDataSource from './interfaces/ContentDataSource';
import type ProductCatalogDataSource from './interfaces/ProductCatalogDataSource';
import type ProductRecommendationDataSource from './interfaces/ProductRecommendationDataSource';
import type ProductSearchDataSource from './interfaces/ProductSearchDataSource';

export default interface CommerceDataSource
  extends AccountDataSource,
    ContentDataSource,
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
   * @param ids - An array of product identifiers to query
   * @return A Promise representing an array of product metadata
   */
  fetchProducts?: (ids: string[]) => Promise<Product[]>;
}
