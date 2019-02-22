// tslint:disable cyclomatic-complexity

import {
  CommerceCookieSessionManager,
  CommerceTypes as FSCommerceTypes,
  runMiddleware
} from '@brandingbrand/fscommerce';
import {
  DemandwareConfig,
  ExtendedProductItem,
  Middleware
} from '../Types';
import FSNetwork, { FSNetworkResponse } from '@brandingbrand/fsnetwork';
import demandwareNormalizer from '../DemandwareNormalizer';

const kEndpointAuth = '/customers/auth';

export class DemandwareBase {
  /**
   * A FSNetwork instance that provides a networking interface.
   */
  client: FSNetwork;

  /**
   * An instance of a CommerceSessionManager that provides an interface to get, set,
   * and restore session data.
   */
  sessionManager: CommerceCookieSessionManager;

  /**
   * Object, keyed by method name, that specifies middleware to be run after certain
   * data source methods have been executed.
   */
  middleware: Middleware;

  /**
   * Function that returns a product id from a product result.
   */
  masterToVariantProductId: (searchHit: SFCC.ProductSearchHit) => string;

  /**
   * Minumum number of refinements expected to be applied on product index results. For
   * Demandware, category ID is always automatically provided, so this value is set to one.
   * This is used by ProductIndex to determine if the user has applied their own refinements.
   */
  minRefinements: number = 1;

  /**
   * Default ISO 4217 currency code for the store
   */
  storeCurrencyCode: string;

  /**
   * Demandware expects clients to specify which fields should be returned when
   * querying for products (beyond a limited number of default fields such as title).
   */
  protected readonly productExtraFields: string[] = [
    'availability',
    'promotions',
    'options',
    'images',
    'prices',
    'variations'
  ];

  constructor(config: DemandwareConfig) {
    this.client = config.networkClient || new FSNetwork({
      baseURL: config.endpoint,
      headers: {
        'x-dw-client-id': config.clientId
      }
    });

    this.masterToVariantProductId =
      config.masterToVariantProductId || (p => p.product_id);
    this.middleware = config.middleware || {};
    this.sessionManager = new CommerceCookieSessionManager({
      refreshToken: this.refreshToken,
      createGuestToken: this.createGuestToken,
      createLoginToken: this.createLoginToken,
      destroyToken: this.destroyToken,
      sessionCookiesToToken: this.sessionCookiesToToken,
      restoreCookies: config.restoreCookies
    });
    this.storeCurrencyCode = config.storeCurrencyCode;
  }

  /**
   * Fetch information about multiple products as specified by an array of identifiers.
   *
   * @param {Array.<string>} ids - An array of product identifiers to query
   * @returns {Promise.<Array.<Product>>} A Promise representing an array of product metadata
   */
  async fetchProducts(ids: string[]): Promise<FSCommerceTypes.Product[]> {
    const encodedIds = ids.map(encodeURIComponent).join(',');
    const extraFields = this.productExtraFields.join(',');

    const { data } = await this.client.get<SFCC.ProductResult>(
      `/products/(${encodedIds})?expand=${extraFields}`
    );

    const normalized = (data.data || [])
      .map(item => demandwareNormalizer.product(item, this.storeCurrencyCode));

    return runMiddleware(
      data,
      normalized,
      this.middleware.fetchProducts
    );
  }

  /**
   * Request a new token for a guest session.
   *
   * @returns {Promise.<SessionToken>} A Promise representing a new session token.
   */
  createGuestToken = async (): Promise<FSCommerceTypes.SessionToken> => {
    /*
     * to create guest token
     * - get jwt
     * - post /customers/auth with jwt to set-cookie
     * - don't return anything, because cookie is implicitly saved
     */
    const data = await this.client.post<SFCC.Customer>(kEndpointAuth, {
      type: 'guest'
    });

    const token = demandwareNormalizer.sessionToken(data);
    if (!token) {
      throw new Error('cannot get session token');
    }

    await this.client.post<void>(
      '/sessions',
      {},
      {
        headers: {
          Authorization: token.token.authorization
        }
      }
    );

    return token;
  }

  /**
   * Request that a session token be generated for eixsting session cookies.
   *
   * @returns {Promise.<SessionToken>} A Promise representing a session token
   */
  sessionCookiesToToken = async (): Promise<FSCommerceTypes.SessionToken | null> => {
    const data = await this.client.post<SFCC.Customer>(kEndpointAuth, {
      type: 'session'
    });

    return demandwareNormalizer.sessionToken(data);
  }

  /**
   * Retrieve a session token for a specified username and password.
   *
   * @param {string} username - The username by which the user should be logged in
   * @param {string} password - The password by which the user should be logged in
   * @returns {Promise.<SessionToken>} A Promise representing a token for an authenticated session
   */
  createLoginToken = async (
    username: string,
    password: string
  ): Promise<FSCommerceTypes.SessionToken> => {
    const data = await this.client.post<SFCC.Customer>(
      kEndpointAuth,
      { type: 'credentials' },
      {
        auth: {
          username,
          password
        }
      }
    );

    const userToken = demandwareNormalizer.sessionToken(data);
    if (!userToken) {
      throw new Error('cannot get user token');
    }

    // set cookie with the new loggedIn token
    await this.client.post<void>(
      '/sessions',
      {},
      {
        headers: {
          Authorization: userToken.token.authorization
        }
      }
    );

    return userToken;
  }

  /**
   * Request that the current session token be destroyed.
   *
   * @returns {Promise.<Object>} A Promise representing the response from the operation. This
   * data is not normalized.
   */
  destroyToken = async (): Promise<FSNetworkResponse<void>> => {
    return this.authRequest<void>('delete', kEndpointAuth);
  }

  /**
   * Exchange the current session token for a new token.
   *
   * @param {string} token - The token to be refreshed
   * @returns {Promise.<SessionToken>} A Promise representing a new session token
   */
  refreshToken = async (
    token: FSCommerceTypes.SessionToken
  ): Promise<FSCommerceTypes.SessionToken> => {
    const data = await this.client.post<SFCC.Customer>(
      kEndpointAuth,
      { type: 'refresh' },
      {
        headers: {
          Authorization: token.token.authorization
        }
      }
    );

    const sessionToken = demandwareNormalizer.sessionToken(data);
    if (!sessionToken) {
      throw new Error('cannot get session token');
    }

    return sessionToken;
  }

  /**
   * Augment a cart object with additional metadata about the products contained within.
   *
   * @param {Cart} cartData - The cart object to be augmented
   * @returns {Promise.<Object>} A Promise representing the augmented cart data
   */
  protected async mutateCartDataWithProductDetail(
    cartData: SFCC.Basket
  ): Promise<FSCommerceTypes.Product[]> {
    if (cartData.product_items && cartData.product_items.length) {
      const products = await this.fetchProducts(
        cartData.product_items.map((p: any) => p.product_id)
      );

      products.forEach(p => {
        const match: ExtendedProductItem | undefined = (cartData.product_items || []).find(
          item => item.product_id === p.id
        );
        if (match) {
          match.images = p.images;
          match.description = p.description;
          match.available = p.available;
          match.options = p.options;
          match.variants = p.variants;
          match.promotions = p.promotions;
        }
      });
      return products;
    }
    return [];
  }

  /**
   * Perform a specified request on an authenticated resource by retrieving the current
   * session token.
   *
   * @param {string} method - The HTTP method to be performed (e.g., PUT, GET)
   * @param {string} url - The URL to which the request should be made
   * @param {Object} options - Additional options for the request
   * @returns {Promise.<Object>} A Promise representing the response for the requets
   */
  protected async authRequest<T>(
    method: string,
    url: string | ((token: FSCommerceTypes.SessionToken) => string),
    options: any = {}
  ): Promise<FSNetworkResponse<T>> {
    const token = await this.sessionManager.get();
    const headers = options.headers || {};

    if (!token) {
      return Promise.reject('Unauthorized');
    }

    const _url = typeof url === 'function' ? url(token) : url;
    return this.client.request<T>({
      url: _url,
      method,
      ...options,
      data: options.data,
      headers: {
        Authorization: token.token.authorization,
        ...headers
      }
    });
  }

  /**
   * Update current cart if a user logs in. If shouldMergeCart is enabled, the pre-existing
   * items in the cart will be merged with the user's last authenticated cart. If
   * shouldMergeCart is disabled the items added before logging in will become the new
   * authenticated cart.
   *
   * @param {SessionToken} guestToken - The token from the user's unauthenticated session
   * @param {SessionToken} userToken - The token for the user's authenticated session
   * @param {Object} options - Additional options to control the merge behavior
   */
  protected async updateUserCartWithGuestCart(
    guestToken: FSCommerceTypes.SessionToken,
    userToken: FSCommerceTypes.SessionToken,
    options: { shouldMergeCart: boolean }
  ): Promise<void> {
    const guestCustomerId = encodeURIComponent(guestToken.token.customer_id);
    const guestCart = await this.client.get<SFCC.BasketsResult>(
      `/customers/${guestCustomerId}/baskets`,
      {
        headers: {
          Authorization: guestToken.token.authorization
        }
      }
    );

    if (!guestCart || !guestCart.data || !guestCart.data.total || !guestCart.data.baskets) {
      return;
    }

    const userCustomerId = encodeURIComponent(userToken.token.customer_id);
    const userCart = await this.client.get<SFCC.BasketsResult>(
      `/customers/${userCustomerId}/baskets`,
      {
        headers: {
          Authorization: userToken.token.authorization
        }
      }
    );

    // merge guest cart into user's cart
    if (options.shouldMergeCart) {
      if (userCart && userCart.data && userCart.data.total && userCart.data.baskets) {
        // add items to existing cart
        await this.client.post<SFCC.Basket>(
          `/baskets/${userCart.data.baskets[0].basket_id}/items`,
          guestCart.data.baskets[0].product_items,
          {
            headers: {
              Authorization: userToken.token.authorization
            }
          }
        );
      } else {
        await this.client.post<SFCC.Basket>('/baskets', guestCart.data.baskets[0], {
          headers: {
            Authorization: userToken.token.authorization
          }
        });
      }
    } else {
      // replace user's cart with guest cart
      if (
        userCart.data &&
        userCart.data.baskets &&
        userCart.data.baskets[0] &&
        userCart.data.baskets[0].basket_id
      ) {
        await this.client.delete(
          `/baskets/${userCart.data.baskets[0].basket_id}`,
          {
            headers: {
              Authorization: userToken.token.authorization
            }
          }
        );
      }

      await this.client.post<SFCC.Basket>('/baskets', guestCart.data.baskets[0], {
        headers: {
          Authorization: userToken.token.authorization
        }
      });
    }
  }
}
