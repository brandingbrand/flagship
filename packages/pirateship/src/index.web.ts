import { FSApp, FSAppTypes } from '@brandingbrand/fsapp';
import screens from './screens';
import reducers from './reducers';
import {
  loadAccountData,
  loadCartData,
  loadPromoProducts,
  loadTopCategories
} from './lib/globalDataLoaders';
import Analytics from './lib/analytics';

const projectEnv = require('../env/env');

const appConfig: FSAppTypes.AppConfigType = {
  packageJson: require('../package.json'),
  appType: 'singleScreen',
  screen: { screen: 'Shop', title: 'Pirate Ship' },
  screens,
  reducers,
  env: projectEnv,
  appStyle: {},
  variables: {},
  drawer: {
    left: {
      screen: 'LeftDrawerMenu'
    },
    disableOpenGesture: false
  },
  analytics: Analytics,
  webRouterType: 'hash'
};

const app = new FSApp(appConfig);
export default app;

// wait for app initialized
requestAnimationFrame(loadAccountData);
requestAnimationFrame(loadCartData);
requestAnimationFrame(loadTopCategories);
requestAnimationFrame(loadPromoProducts);
