import type { RouteComponentType } from '../types';
import type { InternalRouterConfig, RouterConfig } from './types';

export const resolveRoutes = async ({
  api,
  routes,
  externalRoutes,
  screenWrap
}: RouterConfig & InternalRouterConfig) => {
  return [
    ...(await(typeof externalRoutes === 'function' ? externalRoutes(api) : externalRoutes) ?? []),
    ...routes
  ].map(route => {
    if ('component' in route) {
      return {
        ...route,
        component: screenWrap ? screenWrap(route.component) : route.component
      };
    }

    if ('lazyComponent' in route) {
      return {
        ...route,
        lazyComponent: () =>
          new Promise<RouteComponentType>(async (resolve, reject) => {
            route
              .lazyComponent()
              .then(component => {
                resolve(screenWrap ? screenWrap(component) : component);
              })
              .catch(reject);
          }).catch()
      };
    }

    return route;
  });
};
