import { AppRouterOptions } from './types';

export const resolveRoutes = async ({
  routes,
  externalRoutes
}: AppRouterOptions) => {
  return [
    ...((await (typeof externalRoutes === 'function'
      ? externalRoutes()
      : externalRoutes)) ?? []),
    ...routes
  ];
};
