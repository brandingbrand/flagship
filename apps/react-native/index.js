import React from 'react';
import {Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {env, FSAppBeta} from '@brandingbrand/fsapp';
import {initializeReactLinker} from '@brandingbrand/react-linker';

import routes from './src/routes';

initializeReactLinker(React);

Navigation.setDefaultOptions({
  animations: {
    setStackRoot: {
      waitForRender: true,
    },
    setRoot: {
      waitForRender: true,
    },
  },
  statusBar: {
    backgroundColor: '#1e2126',
  },
  layout: {
    backgroundColor: '#1e2126',
  },
});

FSAppBeta.bootstrap({
  version: Platform.select({
    ios: env.ios.versioning.version,
    android: env.android.versioning.version,
  }),
  router: {
    routes,
  },
});
