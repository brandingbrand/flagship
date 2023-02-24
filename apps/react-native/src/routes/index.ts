import type {Routes} from '@brandingbrand/fsapp';

import App from './app';
import PluginPermissions from './plugin-permissions';

export default [
  {
    component: App,
    topBarStyle: {
      visible: false,
    },
    path: '/',
  },
  {
    component: PluginPermissions,
    topBarStyle: {
      visible: false,
    },
    path: '/plugin-permissions',
  },
] as Routes;
