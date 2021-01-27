import FSNetwork from '@brandingbrand/fsnetwork';
import type { ReactNode } from 'react';
import type { ExternalRoutes, RouteComponentType, Routes } from '../types';

export interface RouterConfig {
  readonly root?: Element | string;
  readonly routes: Routes;
  readonly externalRoutes?: ExternalRoutes;
  readonly loading?: ReactNode;
}

export interface InternalRouterConfig {
  api?: FSNetwork;
  screenWrap?: (component: RouteComponentType) => RouteComponentType;
}

export interface AppRouter {
  open(url: string): Promise<void>;
}

export interface AppRouterConstructor<T extends AppRouter = AppRouter> {
  new(routes: Routes, options: RouterConfig & InternalRouterConfig): T;
  register(options: RouterConfig & InternalRouterConfig): Promise<AppRouter>;
}
