import React from 'react';
import {FSAppBeta} from '@brandingbrand/fsapp';
import {initializeReactLinker} from '@brandingbrand/react-linker';

import {routes} from './routes';
import DeviceInfo from 'react-native-device-info';

initializeReactLinker(React);

FSAppBeta.bootstrap({
  version: DeviceInfo.getVersion(),
  router: {
    routes,
  },
});
