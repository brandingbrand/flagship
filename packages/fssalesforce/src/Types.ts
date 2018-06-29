import {
  CommerceTypes,
  MiddlewareFunction
} from '@brandingbrand/fscommerce';
import FSNetwork from '@brandingbrand/fsnetwork';

/**
 * Interface prescribing middleware configuration
 *
 * @example
 * {
 *   fetchCategory: (data, normalized) => { ... }
 * }
 *
 * {
 *   fetchCategory: [(data, normalized) => { ... }, (data, normalized) => { ... }]
 * }
 */
export interface Middleware {
  [key: string]: MiddlewareFunction | MiddlewareFunction[];
}

/**
 * Interface prescribing available options for constructing a new instance of the
 * Demandware data source.
 */
export interface DemandwareConfig {
  /**
   * An identifier corresponding to a client in Demandware.
   *
   * @example '15kad-3ajk-ad189a0-ak138acjkla'
   */
  clientId: string;

  /**
   * URL pointing to a specific version of the Demandware API.
   *
   * @example 'https://client.demandware.net/s/Sites-Site/dw/shop/17_8'
   */
  endpoint: string;

  /**
   * Object specifying functions to be invoked after specified data source operations
   * have completed. The object should be keyed by the method name to extend and set
   * to a function that accepts (data, normalized) and returns normalized data.
   *
   * @example {
   *   fetchProduct: (originalData, normalizedData) => { ... }
   * }
   */
  middleware?: Middleware;

  /**
   * Function that returns a product id from a product result.
   *
   * @param {Object} searchHit - An object representing a raw search result from Demandware
   * @returns {string} The product ID of the search result's product
   */
  masterToVariantProductId?: (searchHit: SFCC.ProductSearchHit) => string;

  /**
   * Function that restores a user's cookies. This is passed to CommerceCookieSessionManager.
   *
   * @returns {Promise.<void>} A Promise that is rejected if the operation fails
   */
  restoreCookies?: () => Promise<void>;

  /**
   * Pre initalized network client to use for requests. To be used for testing.
   */
  networkClient?: FSNetwork;

  /**
   * Default ISO 4217 currency code for the store. Used for price formatting.
   * @example 'USD'
   */
  storeCurrencyCode: string;
}

/**
 * Interface prescribing the options that Demandware expects to receive when querying
 * for products.
 */
export interface DemandwareProductQuery {
  /**
   * The maximum number of products to retrieve.
   *
   * @example 30
   */
  count?: number;

  /**
   * Index of first item to retrieve. Used for data pagination. Starts at 0.
   *
   * @example 1
   */
  start?: number;

  /**
   * ISO 4217 currency code to dictate how prices will be formatted.
   *
   * @example 'USD'
   */
  currency?: string;

  /**
   * Language culture name for which product information will be returned.
   *
   * @example 'en-US'
   */
  locale?: string;

  /**
   * A key corresponding to a sorting method to be applied to the results.
   *
   * @example 'top-sellers'
   */
  sort?: string;

  /**
   * One or more additional fields to be returned for each product. Values are comma-separated.
   *
   * @example 'options,images'
   */
  expand?: string;

  /**
   * The query phrase to search for.
   *
   * @example 'shoes'
   */
  q?: string;

  /**
   * IDs of refinements and corresponding values to filter the product results.
   *
   * @example {
   *  'cgid': ['womens']
   * }
   */
  refinements?: any;

  /**
   * any extra key value pair
   *
   * @example {
   *  'refine_12': 'green'
   * }
   */
  [key: string]: any;
}

export interface ExtendedProductItem extends SFCC.ProductItem {
  images?: CommerceTypes.Image[];
  description?: string;
  available?: boolean;
  options?: CommerceTypes.Option[];
  variants?: CommerceTypes.Variant[];
  promotions?: string[];
}

export interface BasketWithProductDetails extends SFCC.Basket {
  product_details?: CommerceTypes.Product[];
}

export type ValidOrderStatus = 'created' |
  'new' |
  'open' |
  'completed' |
  'cancelled' |
  'replaced' |
  'failed';
