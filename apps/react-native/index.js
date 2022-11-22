import {FSAppBeta} from '@brandingbrand/fsapp';

import App from './App';

FSAppBeta.bootstrap({
  version: '1.0.0',
  router: {
    routes: [
      {
        component: App,
        topBarStyle: {
          visible: false,
        },
      },
    ],
  },
});
