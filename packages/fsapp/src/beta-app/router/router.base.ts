import type { FSRouterHistory } from './history';
import type {
  FSRouter,
  FSRouterConstructor,
  InternalRouterConfig,
  RouterConfig,
  Routes
} from './types';

import { Linking } from 'react-native';

import { Injector } from '@brandingbrand/fslinker';

import { MODAL_CONTEXT_TOKEN, ModalContext } from '../modal';
import {
  ACTIVATED_ROUTE_CONTEXT_TOKEN,
  ActivatedRouteContext,
  BUTTON_CONTEXT_TOKEN,
  ButtonContext,
  DATA_CONTEXT_TOKEN,
  DataContext,
  LOADING_CONTEXT_TOKEN,
  LoadingContext,
  NAVIGATOR_CONTEXT_TOKEN,
  NavigatorContext,
  PARAM_CONTEXT_TOKEN,
  ParamContext,
  PATH_CONTEXT_TOKEN,
  PathContext,
  QUERY_CONTEXT_TOKEN,
  QueryContext,
  NAVIGATOR_TOKEN
} from './context';
import { getPath, resolveRoutes } from './utils';

export abstract class FSRouterBase implements FSRouter {
  public static async register<T extends FSRouterBase>(
    this: FSRouterConstructor<T>,
    options: RouterConfig & InternalRouterConfig
  ): Promise<T> {
    const mergedRoutes = await resolveRoutes(options);
    return new this(mergedRoutes, options);
  }

  constructor(public readonly routes: Routes, protected readonly history: FSRouterHistory) {
    Injector.provide({ provide: LOADING_CONTEXT_TOKEN, useValue: LoadingContext });
    Injector.provide({ provide: DATA_CONTEXT_TOKEN, useValue: DataContext });
    Injector.provide({ provide: QUERY_CONTEXT_TOKEN, useValue: QueryContext });
    Injector.provide({ provide: PARAM_CONTEXT_TOKEN, useValue: ParamContext });
    Injector.provide({ provide: PATH_CONTEXT_TOKEN, useValue: PathContext });
    Injector.provide({ provide: ACTIVATED_ROUTE_CONTEXT_TOKEN, useValue: ActivatedRouteContext });
    Injector.provide({ provide: NAVIGATOR_CONTEXT_TOKEN, useValue: NavigatorContext });
    Injector.provide({ provide: MODAL_CONTEXT_TOKEN, useValue: ModalContext });
    Injector.provide({ provide: BUTTON_CONTEXT_TOKEN, useValue: ButtonContext });
    Injector.provide({ provide: NAVIGATOR_TOKEN, useValue: history });
  }

  public async open(url: string): Promise<void> {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      const path = getPath(url);
      return this.history.open(path.startsWith('/') ? path : `/${path}`);
    }
  }
}
