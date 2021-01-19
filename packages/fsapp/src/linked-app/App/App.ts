import type { AppConstructor, AppOptions } from './types';

import { Linking } from 'react-native';

import { AppRouter } from '../AppRouter';
import { StaticImplements } from '../utils';
import { AppBase } from './AppBase';

@StaticImplements<AppConstructor>()
export class App extends AppBase {
  public static async bootstrap({
    name,
    router: routerOptions
  }: AppOptions): Promise<App> {
    return AppRouter.register({
      name,
      ...routerOptions
    }).then(router => new App(router));
  }

  private constructor(router: AppRouter) {
    super(router);
    Linking.addEventListener('url', ({ url }) => this.openUrl(url));
    Linking.getInitialURL().then(async url => {
      if (url) {
        await this.openUrl(url);
      }
    }).catch();
  }
}
