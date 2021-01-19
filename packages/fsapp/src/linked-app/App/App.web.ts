import type { AppConstructor, AppOptions } from './types';

import { AppRouter } from '../AppRouter';

import { StaticImplements } from '../utils';
import { AppBase } from './AppBase';

@StaticImplements<AppConstructor>()
export class App extends AppBase {
  public static async bootstrap({ name, router }: AppOptions): Promise<App> {
    return AppRouter.register({ name, ...router }).then(appRouter => new App(appRouter));
  }

  private constructor(router: AppRouter) {
    super(router);
  }
}
