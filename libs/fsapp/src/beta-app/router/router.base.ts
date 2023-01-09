import { Linking } from 'react-native';

import { Injector } from '@brandingbrand/fslinker';

import { ReplaySubject, filter, lastValueFrom, take } from 'rxjs';

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
  NAVIGATOR_TOKEN,
  NavigatorContext,
  PARAM_CONTEXT_TOKEN,
  PATH_CONTEXT_TOKEN,
  ParamContext,
  PathContext,
  QUERY_CONTEXT_TOKEN,
  QueryContext,
  URL_CONTEXT_TOKEN,
  UrlContext,
} from './context';
import type { FSRouterHistory } from './history';
import type {
  FSRouter,
  FSRouterConstructor,
  InternalRouterConfig,
  RouterConfig,
  Routes,
} from './types';
import { getPath, resolveRoutes } from './utils';

export abstract class FSRouterBase implements FSRouter {
  public static async register<T extends FSRouterBase>(
    this: FSRouterConstructor<T>,
    options: InternalRouterConfig & RouterConfig
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
    Injector.provide({ provide: URL_CONTEXT_TOKEN, useValue: UrlContext });
    Injector.provide({ provide: ACTIVATED_ROUTE_CONTEXT_TOKEN, useValue: ActivatedRouteContext });
    Injector.provide({ provide: NAVIGATOR_CONTEXT_TOKEN, useValue: NavigatorContext });
    Injector.provide({ provide: MODAL_CONTEXT_TOKEN, useValue: ModalContext });
    Injector.provide({ provide: BUTTON_CONTEXT_TOKEN, useValue: ButtonContext });
    Injector.provide({ provide: NAVIGATOR_TOKEN, useValue: history });
  }

  // eslint-disable-next-line rxjs/no-exposed-subjects -- extended
  protected readonly isStable$ = new ReplaySubject<boolean>(1);

  public async isStable(): Promise<boolean> {
    return lastValueFrom(
      this.isStable$.pipe(
        filter((isStable) => isStable),
        take(1)
      )
    );
  }

  public async open(url: string): Promise<void> {
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      const path = getPath(url);
      this.history.open(path.startsWith('/') ? path : `/${path}`);
    }
  }
}
