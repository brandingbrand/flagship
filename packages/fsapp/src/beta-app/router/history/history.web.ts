import type { ActivatedRoute, MatchingRoute, Routes } from '../types';
import type { FSRouterHistory, LoadingListener, RequiredTitle, ResolverListener } from './types';

import { boundMethod } from 'autobind-decorator';
import {
  Action,
  createBrowserHistory,
  History as BrowserHistory,
  Location,
  LocationDescriptor,
  LocationDescriptorObject,
  LocationListener,
  TransitionPromptHook,
  UnregisterCallback
} from 'history';
import { cloneDeep, uniqueId } from 'lodash-es';

import { promisedEntries } from '../../utils';

import { buildMatchers, matchRoute, resolveRoute, stringifyLocation } from './utils.web';
import { Matchers } from './utils.base';

export class History implements FSRouterHistory {
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
  private readonly browserHistory: BrowserHistory = createBrowserHistory();
  private readonly activationObservers: Map<string, ResolverListener> = new Map();
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
  public open(location: LocationDescriptor<unknown>): Promise<void>;
  @boundMethod
  public async open(to: LocationDescriptor, state?: unknown): Promise<void> {
    if (typeof to === 'string') {
      return this.push(to, state);
    } else {
      return this.push(to);
    }
  }

  public push(path: string, state?: unknown): Promise<void>;
  public push(location: LocationDescriptor): Promise<void>;
  @boundMethod
  public async push(to: LocationDescriptor, state?: unknown): Promise<void> {
    if (typeof to === 'string') {
      if (/^\w+:\/\//.exec(to)) {
        window.location.href = to;
      } else {
        this.browserHistory.push(to, state);
      }
    } else {
      if (to?.pathname && /^\w+:\/\//.exec(to.pathname)) {
        window.location.href = to.pathname;
      } else if (to) {
        this.browserHistory.push(to);
      }
    }
    await this.nextLoad;
  }

  public replace(path: string, state?: unknown): Promise<void>;
  public replace(location: LocationDescriptor): Promise<void>;
  @boundMethod
  public async replace(
    pathOrLocation: string | LocationDescriptor,
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
  public registerResolver(listener: ResolverListener): UnregisterCallback {
    const id = uniqueId('resolver-subscriber');

    this.activationObservers.set(id, listener);
    return () => {
      this.activationObservers.delete(id);
    };
  }

  @boundMethod
  public createHref(location: LocationDescriptorObject): string {
    return this.browserHistory.createHref(location);
  }

  @boundMethod
  public updateTitle(title: RequiredTitle): void {
    document.title = typeof title === 'string' ? title : title.text;
  }

  private async initialNavigation(): Promise<void> {
    const matchingRoute = await matchRoute(this.matchers, stringifyLocation(location));

    if (matchingRoute) {
      await this.activateRoute(matchingRoute, this.browserHistory.location.state);
      this._action = this.browserHistory.action;
      this._location = this.browserHistory.location;
      this.locationObservers.forEach(listener => {
        listener(this.browserHistory.location, this.browserHistory.action);
      });
    }
  }

  private async activateRoute(matchingRoute: MatchingRoute, state: unknown): Promise<void> {
    this.setLoading(true);
    const activatedRoute = await this.resolveRouteDetails(matchingRoute, state);
    this.activationObservers.forEach(listener => {
      listener(activatedRoute);
    });

    const title =
      typeof matchingRoute.title === 'function'
        ? await matchingRoute.title(activatedRoute)
        : matchingRoute.title;

    if (title) {
      document.title = title;
    }

    this.setLoading(false);
  }

  private observeNavigation(): void {
    this.browserHistory.listen(async (location, action) => {
      const unblock = this.browserHistory.block(true);
      const matchingRoute = await matchRoute(this.matchers, stringifyLocation(location));
      if (matchingRoute) {
        await this.activateRoute(matchingRoute, location.state);
        this._action = action;
        this._location = location;
        this.locationObservers.forEach(listener => {
          listener(location, action);
        });
        window.scrollTo(0, 0);
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

  private async resolveRouteDetails(
    matchingRoute: MatchingRoute,
    state: unknown
  ): Promise<ActivatedRoute> {
    const resolvedData = await promisedEntries(resolveRoute(matchingRoute));
    return {
      data: { ...resolvedData, ...(typeof state === 'object' ? state : {}) },
      query: matchingRoute.query,
      params: matchingRoute.params,
      path: matchingRoute.matchedPath,
      loading: true
    };
  }
}
