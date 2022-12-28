import React from 'react';
import {FSAppBeta} from '@brandingbrand/fsapp';
import {initializeReactLinker} from '@brandingbrand/react-linker';

import App from './src/screens/App';

initializeReactLinker(React);

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
