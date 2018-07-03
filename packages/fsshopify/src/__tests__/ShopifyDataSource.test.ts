// yarn run test in the packages/fsshopify directory only runs these tests
const mockDirName = __dirname;

jest.mock('react-native', () => {
  return {
    default: {},
    requireNativeComponent: () => false,
    NativeModules: {
      ReactNativePayments: {}
    },
    Platform: {
      os: 'test'
    },
    StyleSheet: {
      create: () => true
    },
    AppRegistry: {
      getRunnable: () => false
    }
  };
});

jest.mock('react-native-navigation', () => {
  return {
    Navigation: {
      registerComponent: () => false
    }
  };
});

jest.mock('@brandingbrand/fsnetwork', () => {
  const axios = require('axios'); // tslint:disable-line:no-implicit-dependencies
  const crypto = require('crypto');
  const path = require('path');
  const fs = require('fs');

  class MockNetwork {
    axiosInstance: any;

    constructor(config: any) {
      this.axiosInstance = axios.create({
        baseURL: config.baseURL,
        headers: {...config.headers, 'Content-Type': 'application/json'}
      });
    }

    post(url: string, data: Object): any {
      data = JSON.stringify(data);

      const cacheFile = crypto.createHash('md5').update(data).digest('hex') + '.json';
      const cachePath = path.resolve(mockDirName, 'fixtures', cacheFile);

      if (fs.existsSync(cachePath)) {
        return new Promise<any>(resolve => resolve({
          status: 200,
          data: require(cachePath)
        }));
      } else {
        return this.axiosInstance
          .post('https://flagshipdemo.myshopify.com/api/graphql', data)
          .then((response: any) => {
            fs.writeFileSync(cachePath, JSON.stringify(response.data, null, 2));
            return response;
          });
      }
    }
  }

  return MockNetwork;
});

import ShopifyDataSource from '../ShopifyDataSource';
import Decimal from 'decimal.js';

let dataSource: ShopifyDataSource;

describe('ShopifyDataSource', () => {

  test('constructor', () => {
    dataSource = new ShopifyDataSource({
      domain: 'https://flagshipdemo.myshopify.com/api/graphql',
      storefrontAccessToken: '76f12786038b796aef137d56950644e7',
      googlePayPublicKey: '',
      storeCurrencyCode: 'USD'
    });
  });

  test('fetchProduct', async () => {
    // tslint:disable-next-line:ter-max-len
    const product = await dataSource.fetchProduct('Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzE0MjMwOTgxMTgyNjI=');
    expect(product).toBeTruthy();
    expect(product.id).toBeTruthy();
  });

  test('addToCart', async () => {
    const item = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8xMzE1NjU4Mjk0ODk4Mg==';
    const product = {
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzE0MjMwOTgxMTgyNjI=',
      title: '',
      price: {
        value: new Decimal(123),
        currencyCode: 'USD'
      }
    };

    const checkout = await dataSource.addToCart(item, 1, product);
    expect(checkout).toBeTruthy();
    expect(checkout.items[0].handle).toEqual(item);
  });

});
