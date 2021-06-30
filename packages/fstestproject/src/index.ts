import { FSApp, FSAppTypes } from '@brandingbrand/fsapp';
import screens from './screens';

const appConfig: FSAppTypes.AppConfigType = {
  screens,
  appType: 'singleScreen',
  screen: {
    name: 'Home',
    options: {
      topBar: {
        title: {
          text: 'Home'
        }
      }
    }
  }
};

const app: FSApp = new FSApp(appConfig);

export default app;
