import { ReactNode } from 'react';
import type { ExternalRoutes, RouteComponentType, Routes } from '../types';

export interface RouterConfig {
  routes: Routes;
  externalRoutes?: ExternalRoutes;
  loading?: ReactNode;
  screenWrap?: (component: RouteComponentType) => RouteComponentType;
}

export interface AppRouter {
  open(url: string): Promise<void>;
}

export interface AppRouterConstructor {
  register(options: RouterConfig & { name: string }): Promise<AppRouter>;
}
