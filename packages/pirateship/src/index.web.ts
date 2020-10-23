import { appConfig } from './appConfig';
import { FSApp, FSAppTypes } from '@brandingbrand/fsapp';
import Analytics from './lib/analytics';

const webConfig: FSAppTypes.AppConfigType = {
  ...appConfig,
  appType: 'singleScreen',
  screen: { name: 'Shop', options: {
    title: 'Pirate Ship'
  }},
  tabs: undefined,
  drawer: {
    left: {
      screen: 'LeftDrawerMenu'
    },
    disableOpenGesture: false
  },
  analytics: Analytics
};

// @ts-ignore May be set by SSR
if (window.initialState) {
  webConfig.initialState = {
    ...webConfig.initialState,
    // @ts-ignore
    ...window.initialState
  };
}

const app = new FSApp(webConfig);
export default app;
