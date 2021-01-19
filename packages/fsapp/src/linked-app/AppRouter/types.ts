import type { ExternalRoutes, Routes } from '../types';

export interface AppRouterOptions {
  routes: Routes;
  externalRoutes?: ExternalRoutes;
  loading?: React.ReactNode;
}

export interface AppRouter {
  open(url: string): Promise<void>;
}

export interface AppRouterConstructor {
  register(options: AppRouterOptions & { name: string }): Promise<AppRouter>;
}
