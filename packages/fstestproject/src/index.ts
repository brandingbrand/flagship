import { FSApp, FSAppTypes } from '@brandingbrand/fsapp';
import screens from './screens';

const appConfig: FSAppTypes.AppConfigType = {
  screens,
  appType: 'singleScreen',
  screen: {
    screen: 'Home',
    title: 'Home'
  }
};

const app: FSApp = new FSApp(appConfig);

export default app;
