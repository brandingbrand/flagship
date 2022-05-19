import type { Options } from 'react-native-navigation';

import type { Analytics } from '@brandingbrand/fsengage';
import { Injector } from '@brandingbrand/fslinker';
import type { FSNetworkRequestConfig } from '@brandingbrand/fsnetwork';

import type { Middleware } from 'redux';

import { FSAppBeta } from '../app';
import type { RouterConfig } from '../router';
import { setRootStackId, setRootStackOptions } from '../router/history/constants';
import type { ShellConfig } from '../shell.web';

import { applyDefaultOptions } from './internal/apply-default-options';
import { LEGACY_ROUTES } from './internal/screens.token';
import { drawerToWebShell } from './internal/utils/drawer-to-web-shell';
import { layoutComponentsToRoutes } from './internal/utils/layout-components-to-routes';
import { LEGACY_PATH_MAP } from './internal/utils/layout-to-path';
import type { LegacyDrawer } from './legacy-drawer';
import type { LegacyNavLayout, LegacyNavLayoutComponent, LegacyTab } from './legacy-navigator.type';
import type { LegacyRoutableComponentClass, LegacySSRData } from './legacy-route.type';

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
  notFoundRedirect?: LegacyNavLayout | LegacyRoutableComponentClass | true;

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
   * @param config
   * @deprecated
   */
  bootstrap: async (config: FSLegacyShimConfig): Promise<FSAppBeta> => {
    applyDefaultOptions(config.defaultOptions);
    setRootStackId(config.bottomTabsId);
    setRootStackOptions(config.bottomTabsOptions);

    const { legacyRoutes, paths, routes } = layoutComponentsToRoutes(config);
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
