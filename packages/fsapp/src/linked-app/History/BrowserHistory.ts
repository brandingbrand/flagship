import type { ActivatedRoute, MatchingRoute, Routes } from '../types';
import type { LoadingListener, ResolverListener, RouterHistory } from './types';

import { boundMethod } from 'autobind-decorator';
import {
  Action,
  createBrowserHistory,
  History,
  Location,
  LocationDescriptor,
  LocationDescriptorObject,
  LocationListener,
  TransitionPromptHook,
  UnregisterCallback
} from 'history';
import { cloneDeep, uniqueId } from 'lodash-es';

import { promisedEntries } from '../utils';

import { buildMatchers, matchRoute, resolveRoute, stringifyLocation } from './utils-web';
import { Matchers } from './utils';

export class BrowserHistory implements RouterHistory {
  private get nextLoad(): Promise<void> {
    return new Promise(resolve => {
      const remove = this.observeLoading(() => {
        resolve();
        remove();
      });
    });
  }

  public get length(): number {
    return this.browserHistory.length;
  }
  public get action(): Action {
    return this._action;
  }
  public get location(): Location<unknown> {
    return this._location;
  }

  private readonly matchers: Matchers = buildMatchers(this.routes);
  private readonly browserHistory: History = createBrowserHistory();
  private readonly activationObservers: Map<string, Map<string, ResolverListener>> = new Map();
  private readonly loadingObservers: Map<string, LoadingListener> = new Map();
  private readonly locationObservers: Map<string, LocationListener> = new Map();

  private _action: Action = this.browserHistory.action;

  private _location: Location = Object.freeze(cloneDeep(this.browserHistory.location));
  constructor(private readonly routes: Routes) {
    this.initialNavigation()
      .then(() => {
        this.observeNavigation();
      })
      .catch();
  }

  public open(path: string, state?: unknown): Promise<void>;
  public open(location: History.LocationDescriptor<unknown>): Promise<void>;
  @boundMethod
  public async open(to: LocationDescriptor, state?: unknown): Promise<void> {
    if (typeof to === 'string') {
      return this.push(to, state);
    } else {
      return this.push(to);
    }
  }

  public push(path: string, state?: unknown): Promise<void>;
  public push(location: History.LocationDescriptor): Promise<void>;
  @boundMethod
  public async push(to: LocationDescriptor, state?: unknown): Promise<void> {
    if (typeof to === 'string') {
      this.browserHistory.push(to, state);
    } else {
      this.browserHistory.push(to);
    }
    await this.nextLoad;
  }

  public replace(path: string, state?: unknown): Promise<void>;
  public replace(location: History.LocationDescriptor): Promise<void>;
  @boundMethod
  public async replace(
    pathOrLocation: string | History.LocationDescriptor,
    state?: unknown
  ): Promise<void> {
    if (typeof pathOrLocation === 'string') {
      this.browserHistory.replace(pathOrLocation, state);
    } else {
      this.browserHistory.replace(pathOrLocation);
    }
    await this.nextLoad;
  }

  @boundMethod
  public async go(n: number): Promise<void> {
    this.browserHistory.go(n);
    await this.nextLoad;
  }

  @boundMethod
  public async pop(): Promise<void> {
    this.browserHistory.goBack();
    await this.nextLoad;
  }

  @boundMethod
  public async goBack(): Promise<void> {
    this.browserHistory.goBack();
    await this.nextLoad;
  }

  @boundMethod
  public async goForward(): Promise<void> {
    this.browserHistory.goForward();
    await this.nextLoad;
  }

  @boundMethod
  public block(prompt?: string | boolean | TransitionPromptHook): UnregisterCallback {
    return this.browserHistory.block(prompt);
  }

  @boundMethod
  public listen(listener: LocationListener): UnregisterCallback {
    const id = uniqueId('resolver-listeners');
    this.locationObservers.set(id, listener);
    return () => {
      this.locationObservers.delete(id);
    };
  }

  @boundMethod
  public observeLoading(listener: LoadingListener): UnregisterCallback {
    const id = uniqueId('loading-subscriber');
    this.loadingObservers.set(id, listener);
    return () => {
      this.loadingObservers.delete(id);
    };
  }

  @boundMethod
  public registerResolver(path: string, listener: ResolverListener): UnregisterCallback {
    const id = uniqueId('resolver-subscriber');
    const pathResolvers =
      this.activationObservers.get(path) ??
      (() => {
        const newResolverContainer = new Map<string, ResolverListener>();
        this.activationObservers.set(path, newResolverContainer);
        return newResolverContainer;
      })();

    pathResolvers.set(id, listener);
    return () => {
      pathResolvers.delete(id);
    };
  }

  @boundMethod
  public createHref(location: LocationDescriptorObject): string {
    return this.browserHistory.createHref(location);
  }

  private async initialNavigation(): Promise<void> {
    const matchingRoute = await matchRoute(this.matchers, stringifyLocation(location));

    if (matchingRoute) {
      return this.activateRoute(matchingRoute);
    }
  }

  private async activateRoute(matchingRoute: MatchingRoute): Promise<void> {
    this.setLoading(true);
    const details = await this.resolveRouteDetails(matchingRoute);
    [...(this.activationObservers.get(matchingRoute.id)?.values() ?? [])]?.forEach(listener => {
      listener(details);
    });

    document.title =
      typeof matchingRoute.title === 'function'
        ? await matchingRoute.title(details)
        : matchingRoute.title;

    this.setLoading(false);
  }

  private observeNavigation(): void {
    this.browserHistory.listen(async (location, action) => {
      const unblock = this.browserHistory.block(true);
      const matchingRoute = await matchRoute(this.matchers, stringifyLocation(location));
      if (matchingRoute) {
        await this.activateRoute(matchingRoute);
        this._action = action;
        this._location = location;
        this.locationObservers.forEach(listener => {
          listener(location, action);
        });
        this.setLoading(false);
        unblock();
      } else {
        unblock();
      }
    });
  }

  private setLoading(loading: boolean): void {
    this.loadingObservers.forEach(callback => callback(loading));
  }

  private async resolveRouteDetails(matchingRoute: MatchingRoute): Promise<ActivatedRoute> {
    const resolvedData = await promisedEntries(resolveRoute(matchingRoute));
    return {
      data: resolvedData,
      query: matchingRoute.query,
      params: matchingRoute.params,
      loading: true
    };
  }
}
