import { appConfig } from './appConfig';
import type { FSAppTypes } from '@brandingbrand/fsapp';
// tslint:disable-next-line: no-submodule-imports
import { attachSSR, SSROptions } from '@brandingbrand/fsapp/dist/lib/ssr';
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

export default function(app: any, options?: SSROptions): void {
  attachSSR(app, webConfig, options);
}
