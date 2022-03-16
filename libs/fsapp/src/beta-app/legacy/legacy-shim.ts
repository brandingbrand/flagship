import type { Middleware } from 'redux';
import type { Options } from 'react-native-navigation';
import type { Analytics } from '@brandingbrand/fsengage';
import type { FSNetworkRequestConfig } from '@brandingbrand/fsnetwork';
import type { RouterConfig } from '../router';
import type { ShellConfig } from '../shell.web';

import type { LegacyDrawer } from './legacy-drawer';
import type { LegacyRoutableComponentClass, LegacySSRData } from './legacy-route.type';
import type { LegacyNavLayout, LegacyNavLayoutComponent, LegacyTab } from './legacy-navigator.type';

import { Injector } from '@brandingbrand/fslinker';

import { FSAppBeta } from '../app';
import { setRootStackId, setRootStackOptions } from '../router/history/constants';

import { applyDefaultOptions } from './internal/apply-default-options';
import { layoutComponentsToRoutes } from './internal/utils/layout-components-to-routes';
import { LEGACY_PATH_MAP } from './internal/utils/layout-to-path';
import { LEGACY_ROUTES } from './internal/screens.token';
import { drawerToWebShell } from './internal/utils/drawer-to-web-shell';

/**
 *
 * @deprecated
 */
export interface FSLegacyShimConfig {
  root?: HTMLElement | string;
  remote?: FSNetworkRequestConfig;
  version: string;
  analytics?: Analytics;
  webBasename?: string;

  /**
   *
   * @deprecated
   */
  appType?: 'singleScreen';

  /**
   *
   * @deprecated
   */
  tabs?: LegacyTab[];

  /**
   *
   * @deprecated
   */
  screen?: LegacyNavLayoutComponent;

  /**
   *
   * @deprecated
   */
  screenWeb?: Screen;

  /**
   *
   * @deprecated
   */
  screens: Record<string, LegacyRoutableComponentClass>;

  /**
   *
   * @deprecated
   */
  devMenuScreens?: LegacyNavLayoutComponent[];

  /**
   *
   * @deprecated
   */
  popToRootOnTabPressAndroid?: boolean;

  /**
   *
   * @deprecated
   */
  notFoundRedirect?: LegacyRoutableComponentClass | LegacyNavLayout | true;

  /**
   *
   * @deprecated
   */
  bottomTabsId?: string;

  /**
   *
   * @deprecated
   */
  bottomTabsOptions?: Options;

  // Web Shell
  /**
   *
   * @deprecated
   */
  drawer?: LegacyDrawer;

  /**
   *
   * @deprecated
   */
  defaultOptions?: Options;

  initialState?: any;
  reducers?: any;
  storeMiddleware?: Middleware[];
  uncachedData?: (initialState: any, req?: Request) => Promise<LegacySSRData>;
  cachedData?: (initialState: any, req?: Request) => Promise<LegacySSRData>;

  /**
   * Only affects Web.
   *
   * If the client should hydrate server-rendered HTML.
   */
  hydrate?: boolean;
  variables?: Record<string, any>;
  serverSide?: boolean;
  location?: Location;

  // New FSApp
  webShell?: ShellConfig;
  router?: RouterConfig;
}

/**
 *
 * @deprecated
 */
// Explicity not a class
export const FSLegacyShim = {
  /**
   *
   * @deprecated
   */
  async bootstrap(config: FSLegacyShimConfig): Promise<FSAppBeta> {
    applyDefaultOptions(config.defaultOptions);
    setRootStackId(config.bottomTabsId);
    setRootStackOptions(config.bottomTabsOptions);

    const { paths, routes, legacyRoutes } = layoutComponentsToRoutes(config);
    Injector.provide({ provide: LEGACY_PATH_MAP, useValue: paths });
    Injector.provide({ provide: LEGACY_ROUTES, useValue: legacyRoutes });

    const webShell = drawerToWebShell(legacyRoutes, config.drawer);

    return FSAppBeta.bootstrap({
      root: config.root,
      remote: config.remote,
      version: config.version,
      analytics: config.analytics,
      router: {
        ...config.router,
        routes: [...(config.router?.routes ?? []), ...routes],
        basename: config.router?.basename ?? config.webBasename,
      },
      webShell: { ...webShell, ...config.webShell },
      state: {
        initialState: config.initialState,
        reducers: config.reducers,
        cachedData: config.cachedData,
        uncachedData: config.uncachedData,
        middleware: config.storeMiddleware,
      },

      // SSR
      hydrate: config.hydrate,
      ...(config.serverSide ? { serverSide: config.serverSide } : {}),
    });
  },
};
