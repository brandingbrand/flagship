import type { ReactNode } from 'react';
import type { ExternalRoutes, RouteComponentType, Routes } from '../types';

export interface RouterConfig {
  routes: Routes;
  externalRoutes?: ExternalRoutes;
  loading?: ReactNode;
}

export interface InternalRouterConfig {
  screenWrap?: (component: RouteComponentType) => RouteComponentType;
}

export interface AppRouter {
  open(url: string): Promise<void>;
}

export interface AppRouterConstructor<T extends AppRouter = AppRouter> {
  new(routes: Routes, options: RouterConfig): T;
  register(options: RouterConfig & { name: string }): Promise<AppRouter>;
}
