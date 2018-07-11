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
}
