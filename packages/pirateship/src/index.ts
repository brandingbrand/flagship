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
      screen: 'Shop',
      label: 'Shop',
      title: 'Shop',
      icon: require('../assets/images/shop-tab-icon.png')
    },
    {
      screen: 'Cart',
      label: 'Cart',
      title: 'Cart',
      icon: require('../assets/images/cart-tab-icon.png')
    },
    {
      screen: 'Account',
      label: 'Account',
      title: 'Account',
      icon: require('../assets/images/account-tab-icon.png')
    },
    {
      screen: 'More',
      label: 'More',
      title: 'More',
      icon: require('../assets/images/more-tab-icon.png')
    }
  ],
  tabsStyle: tabBarDefault,
  appStyle: tabBarDefault,
  popToRootOnTabPressAndroid: true,
  devMenuScreens: [{ screen: 'Development' }]
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
