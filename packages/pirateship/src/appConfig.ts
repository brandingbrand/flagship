import { FSAppTypes } from '@brandingbrand/fsapp';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { dataSource } from './lib/datasource';
import screens from './screens';
import reducers from './reducers';
import { tabBarDefault } from './styles/Navigation';
import {
  formatCategories
} from './lib/globalDataLoaders';

const projectEnv = require('../env/env');

export const appConfig: FSAppTypes.AppConfigType = {
  packageJson: require('../package.json'),
  screens,
  reducers,
  env: projectEnv,
  tabs: [
    {
      id: 'HOME_TAB',
      name: 'Home',
      options: {
        topBar: {
          title: {
            text: 'Inbox'
          }
        },
        bottomTab: {
          text: 'Inbox',
          icon: require('../assets/images/shop-inbox-icn.png')
        }
      }
    }, {
      id: 'SHOP_TAB',
      name: 'Shop',
      options: {
        topBar: {
          title: {
            text: 'Shop'
          }
        },
        bottomTab: {
          text: 'Shop',
          icon: require('../assets/images/shop-tab-icon.png')
        }
      }
    },
    {
      id: 'CART_TAB',
      name: 'Cart',
      options: {
        topBar: {
          title: {
            text: 'Cart'
          }
        },
        bottomTab: {
          text: 'Cart',
          icon: require('../assets/images/cart-tab-icon.png')
        }
      }
    },
    {
      id: 'ACCOUNT_TAB',
      name: 'Account',
      options: {
        topBar: {
          title: {
            text: 'Account'
          }
        },
        bottomTab: {
          text: 'Account',
          icon: require('../assets/images/account-tab-icon.png')
        }
      }
    },
    {
      id: 'MORE_TAB',
      name: 'More',
      options: {
        topBar: {
          title: {
            text: 'More'
          }
        },
        bottomTab: {
          text: 'More',
          icon: require('../assets/images/more-tab-icon.png')
        }
      }
    }
  ],
  defaultOptions: tabBarDefault,
  popToRootOnTabPressAndroid: true,
  devMenuScreens: [{ name: 'Development' }],
  bottomTabsId: 'bottomTabs',
  variables: {},
  webRouterType: 'browser',
  notFoundRedirect: true,
  cachedData: async (
    initialData: FSAppTypes.SSRData, req: any
  ): Promise<FSAppTypes.SSRData> => {
    const updatedData = {
      ...initialData
    };
    if (!updatedData.initialState.promoProducts &&
      projectEnv.dataSource && projectEnv.dataSource.promoProducts) {
      updatedData.initialState.promoProducts = await dataSource
        .fetchProductIndex({
          categoryId: projectEnv.dataSource.promoProducts.categoryId,
          limit: 5
        });
    }
    if (!updatedData.initialState.topCategory) {
      updatedData.initialState.topCategory = {
        categories: formatCategories(await dataSource.fetchCategory()).slice(0, 10)
      };
    }

    return updatedData;
  },
  uncachedData: async (
    initialData: FSAppTypes.SSRData, req: any
  ): Promise<FSAppTypes.SSRData> => {
    const updatedData = {
      ...initialData
    };
    if (!updatedData.initialState.account) {
      try {
        const accountData = await dataSource.fetchAccount();
        updatedData.initialState.account = {
          isLoggedIn: !!(accountData && accountData.firstName),
          store: accountData
        };
      } catch (e) {
        console.log('not logged in', e);
      }
    }
    if (!updatedData.initialState.cart) {
      const cartData = await dataSource.fetchCart();
      updatedData.initialState.cart = {
        cartData,
        cartCount: ((cartData && cartData.items) || []).reduce((
          count: number,
          item: CommerceTypes.CartItem
        ) => count + item.quantity, 0),
        isLoading: false,
        verb: 'Loading'
      };
    }

    return updatedData;
  }
};
