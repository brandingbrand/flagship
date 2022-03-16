import type { ComponentRoute, Routes } from '../../../router';

import type {
  LegacyNavLayout,
  LegacyNavLayoutComponent,
  LegacyTab,
} from '../../legacy-navigator.type';
import type { LegacyRoutableComponentClass } from '../../legacy-route.type';

import { makeLegacyScreen } from '../../components/legacy-screen.component';

/**
 * @deprecated
 */
export interface LayoutComponentsToRoutesOptions {
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
  notFoundRedirect?: LegacyRoutableComponentClass | LegacyNavLayout | true;
}

const moveLayoutComponentToFront = (
  root: LegacyNavLayoutComponent | undefined
):
  | ((
      a: [string, LegacyRoutableComponentClass],
      b: [string, LegacyRoutableComponentClass]
    ) => number)
  | undefined => {
  return ([a], [b]) => {
    if (a === root?.name) {
      return -1;
    }

    if (b === root?.name) {
      return 1;
    }

    return 0;
  };
};

const getNotFoundRoutes = (
  options: LayoutComponentsToRoutesOptions,
  paths: Map<string, string>
): Routes => {
  if (options.notFoundRedirect === true) {
    return [{ redirect: '' }];
  }

  if (typeof options.notFoundRedirect === 'object') {
    if ('component' in options.notFoundRedirect && options.notFoundRedirect.component) {
      const redirect = paths.get(`${options.notFoundRedirect.component.name}`);

      if (redirect) {
        return [{ redirect }];
      }
    }
  } else if (options.notFoundRedirect) {
    return [{ component: makeLegacyScreen(options.notFoundRedirect, options.tabs ?? [], options) }];
  }

  return [];
};

/**
 * @internal
 * @deprecated
 */
export const layoutComponentsToRoutes = (options: LayoutComponentsToRoutesOptions) => {
  const pathEntries = Object.entries(options.screens)
    .sort(moveLayoutComponentToFront(options.screen))
    .map(([key, screen]) => [key, screen.path ?? `/_s/${screen.name}`] as const)
    .map(([key, path]) => [key, path.replace(/^\//, '')] as const);

  const paths = new Map(pathEntries);

  const legacyRoutes = new Map(
    Object.entries(options.screens).map(([key, screen]) => {
      const quickDevMenu = options.devMenuScreens?.some(({ name }) => name === key);
      const path = paths.get(key) as string;

      return [
        key,
        {
          path,
          exact: true,
          component: makeLegacyScreen(screen, options.tabs ?? [], options),
          ...(quickDevMenu ? { quickDevMenu } : {}),
        } as ComponentRoute,
      ];
    })
  );

  const tabRoutes: Routes = [
    ...(options.tabs?.map(({ name: key, ...tab }) => {
      const legacyRoute = legacyRoutes.get(`${key}`) as ComponentRoute;
      const path = paths.get(`${key}`) as string;

      return {
        tab: { id: tab.id ?? path, ...tab },
        initialPath: path,
        children: [legacyRoute],
      };
    }) ?? []),
  ];

  const componentRoutes: Routes = Array.from(paths.keys())
    .filter(
      (key) => options.appType === 'singleScreen' || options.tabs?.every(({ name }) => name !== key)
    )
    .map((key) => legacyRoutes.get(`${key}`) as ComponentRoute);

  const redirectRoutes: Routes = [
    { path: '', exact: true, redirect: pathEntries[0][1] },
    ...getNotFoundRoutes(options, paths),
  ];

  return {
    paths,
    legacyRoutes,
    routes: [
      ...(options.appType === 'singleScreen' ? [] : tabRoutes),
      ...componentRoutes,
      ...redirectRoutes,
    ],
  };
};
