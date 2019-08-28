import { FSApp, FSAppTypes } from '@brandingbrand/fsapp';

import screens from './screens';
import reducers from './reducers';
import { tabBarDefault } from './styles/Navigation';
import ScreenVisibilityListener from './lib/ScreenVisibilityListener';
import {
  loadAccountData,
  loadCartData,
  loadPromoProducts,
  loadTopCategories
} from './lib/globalDataLoaders';

const projectEnv = require('../env/env');

const appConfig: FSAppTypes.AppConfigType = {
  packageJson: require('../package.json'),
  screens,
  reducers,
  env: projectEnv,
  tabs: [
    {
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
  bottomTabsId: 'bottomTabs'
};

const app: FSApp = new FSApp(appConfig);

export default app;

// wait for app initialized
requestAnimationFrame(loadCartData);
requestAnimationFrame(loadAccountData);
requestAnimationFrame(loadTopCategories);
requestAnimationFrame(loadPromoProducts);

const screenVisibilityListener = new ScreenVisibilityListener();
screenVisibilityListener.register();
