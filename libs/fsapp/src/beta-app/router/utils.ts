import type { Analytics } from '@brandingbrand/fsengage';
import type {
  ActivatedRoute,
  ActivatorConstructor,
  ActivatorFunction,
  ComponentRoute,
  ExternalRoute,
  InternalRouterConfig,
  LazyComponentRoute,
  Route,
  RouteCollection,
  RouterConfig,
  Tab,
} from './types';

export const resolveRoutes = async ({
  api,
  routes,
  externalRoutes: externalRoutesFactory,
}: RouterConfig & InternalRouterConfig) => {
  const externalRoutes = await (async () => {
    try {
      if (typeof externalRoutesFactory === 'function') {
        return await externalRoutesFactory(api);
      }

      return (await externalRoutesFactory) ?? [];
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.warn(`Failed to load external routes with the following error ${e.message}`);
      } else {
        console.warn('Failed to load external routes');
      }

      return [];
    }
  })();

  const normalizePath = (route: Route | RouteCollection) =>
    'initialPath' in route ? route.initialPath : route.path;

  const ifRouteCollection = <T, F>(
    route: Route | RouteCollection,
    routeCollectionValue: T,
    routeValue: F
  ) => ('initialPath' in route ? routeCollectionValue : routeValue);

  // eslint-disable-next-line complexity
  const findRoute = (
    search: ExternalRoute,
    children = routes,
    prefix = '',
    tabAffinity?: Tab
  ): Tab | undefined => {
    for (const child of children) {
      // Replace Variables
      const searchPath = search.path?.replace(/:\w+(?=\/)?/, ':') ?? '';
      const childPath = normalizePath(child)?.replace(/:\w+(?=\/)?/, ':') ?? '';
      const prefixedPath = `${prefix}/${childPath}`;

      const tab = 'tab' in child ? child.tab : tabAffinity;

      if (
        (tab && search.exact && prefixedPath === `/${searchPath}`) ||
        (!search.exact && prefixedPath?.startsWith(`/${searchPath}` ?? ''))
      ) {
        return tab;
      }

      if ('children' in child) {
        const found = findRoute(
          search,
          child.children,
          ifRouteCollection(child, '', prefixedPath),
          tab
        );
        if (found) {
          return tab;
        }
      }
    }

    return;
  };

  const withTabAffinity = (route: ExternalRoute): ExternalRoute => {
    const tab = findRoute(route);

    return { tabAffinity: tab?.id, ...route };
  };

  const tabbedExternalRoutes = externalRoutes.map(withTabAffinity);
  const universalRoutes = tabbedExternalRoutes.filter(({ tabAffinity }) => !tabAffinity);
  const mergedRoutes = routes.map((route) =>
    'tab' in route
      ? {
          ...route,
          children: [
            ...tabbedExternalRoutes
              .filter(({ tabAffinity }) => tabAffinity === route.tab?.id)
              .map((external) => ({
                ...external,
                path: external.path?.replace(/\/$/, '').replace(/^\//, ''),
              })),
            ...route.children,
          ],
        }
      : route
  );

  return [...universalRoutes, ...mergedRoutes];
};

export const trackView = (
  analytics: Analytics | undefined,
  route: ComponentRoute | LazyComponentRoute,
  filteredRoute: ActivatedRoute | undefined,
  path: string | undefined
) => {
  if (!__DEV__ && filteredRoute && !route.disableTracking) {
    void Promise.resolve(
      typeof route.title === 'string' ? route.title : route.title?.(filteredRoute)
    )
      .then((title) => {
        analytics?.screenview(title ?? path ?? '', {
          url: path ?? '',
        });
      })
      .catch();
  }
};

export const getPath = (url: string) => {
  if (!url.includes('//')) {
    return url;
  }

  const [schema, ...domainAndPath] = url.split('//');
  return schema.includes('http')
    ? `/${domainAndPath.join('/').split('/').slice(1).join('/') ?? ''}`
    : `/${domainAndPath.join('/') ?? ''}`;
};

export const guardRoute = async (
  route: Route,
  routeInfo: Pick<ActivatedRoute, 'params' | 'query' | 'path'>
) => {
  if (!route.canActivate) {
    return true;
  }

  const isClass = (
    classOrFunction: ActivatorConstructor | ActivatorFunction
  ): classOrFunction is ActivatorConstructor =>
    classOrFunction.prototype && 'activate' in classOrFunction.prototype;

  if (isClass(route.canActivate)) {
    return new route.canActivate(routeInfo).activate();
  } else {
    return route.canActivate(routeInfo);
  }
};
