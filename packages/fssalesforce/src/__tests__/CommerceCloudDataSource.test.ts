import { CommerceCloudDataSource } from '../CommerceCloudDataSource';
import FSNetwork from '@brandingbrand/fsnetwork';
import qs from 'qs';
import {
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

const kClientId = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const kEndpoint = 'https://demo-ocapi.demandware.net/s/SiteGenesis/dw/shop/v18_6';
const kSearchTerm = 'mens';

const networkClient = new FSNetwork({
  baseURL: kEndpoint,
  headers: {
    'x-dw-client-id': kClientId
  }
});

describe('Demandware Data Source', () => {
  let dataSource: CommerceCloudDataSource;

  const fetchRootCategory = (() => {
    let rootCategory: Promise<FSCommerceTypes.Category>;

    return async (): Promise<FSCommerceTypes.Category> => {
      if (!rootCategory) {
        rootCategory = dataSource.fetchCategory();
      }

      return rootCategory;
    };
  })();

  const fetchSubcategoryId = (() => {
    let subCategoryId: Promise<string>;

    return async (): Promise<string> => {
      if (!subCategoryId) {
        subCategoryId = fetchRootCategory().then(rootCategory => {
          if (Array.isArray(rootCategory.categories) && rootCategory.categories.length > 0) {
            return rootCategory.categories[0].id;
          }

          throw new Error('root category contains no subcategories');
        });
      }

      return subCategoryId;
    };
  })();

  const fetchProductId = (() => {
    let productId: Promise<string>;

    return async (): Promise<string> => {
      if (!productId) {
        productId = dataSource.search(kSearchTerm).then(index => {
          if (Array.isArray(index.products) && index.products.length > 0) {
            return index.products[0].id;
          }

          throw new Error(`unable to find any products with search term ${kSearchTerm}`);
        });
      }

      return productId;
    };
  })();

  beforeEach(() => {
    dataSource = new CommerceCloudDataSource({
      networkClient: {
        get: (url: string, options: any = {}) => {
          return cachedRequest('get', url, null, options);
        },
        post: (url: string, data: any, options: any = {}) => {
          return cachedRequest('post', url, data, options);
        },
        delete: async () => {
          return Promise.reject('no');
        },
        request: async () => {
          return Promise.reject('no');
        }
      },
      clientId: kClientId,
      endpoint: kEndpoint
    });
  });

  describe('Commerce', () => {
    test('Fetch Root Category', async () => {
      return fetchRootCategory()
        .then(rootCategory => {
          expect(rootCategory).toBeDefined();
          expect(rootCategory.id).toBeTruthy();
          expect(rootCategory.title).toBeTruthy();
          expect(rootCategory.handle).toBeTruthy();
          expect(rootCategory.categories).toBeTruthy();

          if (rootCategory && rootCategory.categories && rootCategory.categories.length) {
            const subCategory = rootCategory.categories[0];

            expect(subCategory).toBeDefined();
            expect(subCategory.id).toBeTruthy();
            expect(subCategory.handle).toBeTruthy();
          }
        });
    });

    test('Fetch Category from ID', async () => {
      return fetchSubcategoryId()
        .then(async id => {
          return dataSource.fetchCategory(id);
        })
        .then(subCategory => {
          expect(subCategory).toBeDefined();
          expect(subCategory.id).toBeTruthy();
        });
    });

    test('Fetch Product Index', async () => {
      return fetchSubcategoryId()
        .then(async id => {
          return dataSource.fetchProductIndex({ categoryId: id });
        })
        .then(productIndex => {
          expect(productIndex).toBeDefined();
          expect(productIndex.products).toBeDefined();

          if (productIndex.products.length > 0) {
            const product = productIndex.products[0];
            expect(product.id).toBeTruthy();
            expect(product.title).toBeTruthy();
            expect(product.handle).toBeTruthy();
            expect(product.price).toBeTruthy();
          }
        });
    });

    test('Search', async () => {
      return dataSource.search(kSearchTerm)
        .then(productIndex => {
          expect(productIndex).toBeDefined();
          expect(productIndex.products).toBeTruthy();
          expect(productIndex.products.length).toBeGreaterThan(0);

          const product = productIndex.products[0];
          expect(product.id).toBeTruthy();
          expect(product.title).toBeTruthy();
          expect(product.handle).toBeTruthy();
          expect(product.price).toBeTruthy();
        });
    });

    test('Search Suggestions', async () => {
      return dataSource.searchSuggestion(kSearchTerm)
        .then(suggestions => {
          expect(suggestions).toBeDefined();
          expect(suggestions.productSuggestions).toBeDefined();

          if (suggestions.productSuggestions) {
            expect(suggestions.productSuggestions.products.length).toBeGreaterThan(0);
          }
        });
    });

    test('Fetch Product', async () => {
      return fetchProductId()
        .then(async id => {
          return dataSource.fetchProduct(id);
        })
        .then(product => {
          expect(product).toBeDefined();
          expect(product.id).toBeTruthy();
          expect(product.title).toBeTruthy();
          expect(product.handle).toBeTruthy();
          expect(product.price).toBeTruthy();

          if (product.variants && product.variants.length > 0) {
            const variant = product.variants[0];
            expect(variant).toBeDefined();
            expect(variant.id).toBeTruthy();
            expect(variant.price).toBeTruthy();
            expect(variant.optionValues).toBeTruthy();
            expect(variant.optionValues.length).toBeGreaterThan(0);

            const optionValue = variant.optionValues[0];
            expect(optionValue.name).toBeTruthy();
            expect(optionValue.value).toBeTruthy();
          }

          if (product.images && product.images.length > 0) {
            const image = product.images[0];
            expect(image).toBeDefined();
            expect(image.uri).toBeTruthy();
          }

          if (product.inventory) {
            expect(typeof product.inventory.orderable).toBe('boolean');
          }
        });
    });

    test('Fetch Products', async () => {
      return fetchProductId()
        .then(async id => {
          return dataSource.fetchProducts([id]);
        })
        .then(products => {
          expect(products).toBeDefined();
          expect(products.length).toBe(1);

          const product = products[0];
          expect(product.id).toBeTruthy();
          expect(product.title).toBeTruthy();
          expect(product.handle).toBeTruthy();
          expect(product.price).toBeTruthy();
        });
    });
  });

  describe('Session', () => {
    test('createGuestToken', async () => {
      return dataSource.createGuestToken()
        .then(tokenData => {
          expect(tokenData).toBeDefined();
          expect(tokenData.token).toBeTruthy();
          expect(tokenData.expiresAt).toBeTruthy();
        });
    });
  });
});

function cachedRequest(method: string, url: string, data: any, options: any): any {
  let fixtureUrl = url + (options.params ? '?' + qs.stringify(options.params) : '');
  fixtureUrl = crypto.createHash('md5').update(fixtureUrl).digest('hex');
  const fixtureFile = path.join(__dirname, 'fixtures', fixtureUrl + '.json');

  if (fs.existsSync(fixtureFile)) {
    return Promise.resolve(require(fixtureFile));
  } else {
    return networkClient[method](url, data || options, options)
      .then((response: any) => {
        fs.writeFileSync(fixtureFile, JSON.stringify({
          data: response.data,
          status: response.status,
          headers: response.headers
        }, null, 2));
        console.log(response.headers.authorization);
        return response;
      });
  }
}
