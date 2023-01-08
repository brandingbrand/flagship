import { boundMethod } from 'autobind-decorator';
import type { Action, History as BrowserHistory, Location, TransitionPromptHook } from 'history';
import {
  LocationDescriptor,
  LocationDescriptorObject,
  LocationListener,
  UnregisterCallback,
  createMemoryHistory,
} from 'history';
import { noop, uniqueId } from 'lodash-es';

import { promisedEntries } from '../../utils';
import type { ActivatedRoute, MatchingRoute, Routes } from '../types';

import { INTERNAL, queueMethod } from './queue.decorator';
import type { FSRouterHistory, HistoryOptions } from './types';
import { LoadingListener, RequiredTitle, ResolverListener } from './types';
import { createKey } from './utils.base';
import type { Matchers } from './utils.base';
import { buildMatchers, matchRoute, resolveRoute, stringifyLocation } from './utils.web';

export class History implements FSRouterHistory {
  constructor(private readonly routes: Routes, protected readonly options?: HistoryOptions) {
    void this.initialNavigation()
      .then(() => {
        this.observeNavigation();
      })
      .catch();
  }

  private get nextLoad(): Promise<void> {
    return new Promise((resolve) => {
      const remove = this.observeLoading(() => {
        resolve();
        remove();
      });
    });
  }

  public get length(): number {
    return this.memoryHistory.length;
  }

  public get action(): Action {
    return this.internalAction;
  }

  public get location(): Location {
    return this.internalLocation;
  }

  private readonly matchers: Matchers = buildMatchers(this.routes);
  private readonly memoryHistory: BrowserHistory = createMemoryHistory({
    initialEntries: [this.options?.location ?? window.location],
    initialIndex: 0,
  });

  private readonly activationObservers = new Map<string, ResolverListener>();
  private readonly loadingObservers = new Map<string, LoadingListener>();
  private readonly locationObservers = new Map<string, LocationListener>();

  private internalAction: Action = this.memoryHistory.action;

  private internalLocation: Location = Object.freeze({
    pathname: '__SPLASH__',
    hash: '',
    search: '',
    state: {},
    key: createKey(),
  });

  private async initialNavigation(): Promise<void> {
    const matchingRoute = await matchRoute(
      this.matchers,
      stringifyLocation(this.options?.location ?? window.location)
    );

    if (matchingRoute) {
      await this.activateRoute(
        this.memoryHistory.location.key,
        matchingRoute,
        this.memoryHistory.location.state
      );
      this.internalAction = this.memoryHistory.action;
      this.internalLocation = this.memoryHistory.location;
      for (const listener of this.locationObservers.values()) {
        listener(this.memoryHistory.location, this.memoryHistory.action);
      }
    }
  }

  private async activateRoute(
    id: string | undefined,
    matchingRoute: MatchingRoute,
    state: unknown
  ): Promise<void> {
    this.setLoading(true);
    const activatedRoute = await this.resolveRouteDetails(id, matchingRoute, state);
    const observer = this.activationObservers.get(matchingRoute.id);
    observer?.(activatedRoute);

    const allObserver = this.activationObservers.get('all');
    allObserver?.(activatedRoute);

    const title =
      typeof matchingRoute.title === 'function'
        ? await matchingRoute.title(activatedRoute)
        : matchingRoute.title;

    if (title !== undefined) {
      document.title = title;
    }

    this.setLoading(false);
  }

  private observeNavigation(): void {
    this.memoryHistory.listen((location, action) => {
      (async () => {
        const unblock = this.memoryHistory.block(true);
        const matchingRoute = await matchRoute(this.matchers, stringifyLocation(location));
        if (matchingRoute) {
          await this.activateRoute(location.key, matchingRoute, location.state);
          this.internalAction = action;
          this.internalLocation = location;
          for (const listener of this.locationObservers.values()) {
            listener(location, action);
          }
          window.scrollTo(0, 0);
          this.setLoading(false);
          unblock();
        } else {
          unblock();
        }
      })()
        .then(noop)
        .catch(noop);
    });
  }

  private setLoading(loading: boolean): void {
    for (const callback of this.loadingObservers.values()) {
      callback(loading);
    }
  }

  private async resolveRouteDetails(
    id: string | undefined,
    matchingRoute: MatchingRoute,
    state: unknown
  ): Promise<ActivatedRoute> {
    const resolvedData = await promisedEntries(resolveRoute(id, matchingRoute));
    return {
      id,
      data: { ...resolvedData, ...(typeof state === 'object' ? state : {}) },
      query: matchingRoute.query,
      params: matchingRoute.params,
      url: matchingRoute.matchedPath,
      path: matchingRoute.path,
      isExact: matchingRoute.path === matchingRoute.matchedPath,
      loading: true,
    };
  }

  public open(path: string, state?: unknown): Promise<void>;
  public open(location: LocationDescriptor): Promise<void>;
  @boundMethod
  @queueMethod
  public async open(to: LocationDescriptor, state?: unknown): Promise<void> {
    if (typeof to === 'string') {
      return this.push(to, state, INTERNAL);
    }
    return this.push(to, INTERNAL);
  }

  public push(path: string, state?: unknown, _internal?: typeof INTERNAL): Promise<void>;
  public push(location: LocationDescriptor, _internal?: typeof INTERNAL): Promise<void>;
  @boundMethod
  @queueMethod
  public async push(
    to: LocationDescriptor,
    state?: unknown,
    _internal?: typeof INTERNAL
  ): Promise<void> {
    if (typeof to === 'string') {
      if (/^\w+:\/\//.test(to)) {
        window.location.href = to;
      } else {
        this.memoryHistory.push(to, state);
        await this.nextLoad;
      }
    } else if (to.pathname !== undefined && /^\w+:\/\//.test(to.pathname)) {
      window.location.href = to.pathname;
    } else {
      this.memoryHistory.push(to);
      await this.nextLoad;
    }
  }

  @boundMethod
  @queueMethod
  public async pushTo(path: string): Promise<void> {
    await this.push(path, {}, INTERNAL);
  }

  public replace(path: string, state?: unknown): Promise<void>;
  public replace(location: LocationDescriptor): Promise<void>;
  @boundMethod
  @queueMethod
  public async replace(
    pathOrLocation: LocationDescriptor | string,
    state?: unknown
  ): Promise<void> {
    if (typeof pathOrLocation === 'string') {
      this.memoryHistory.replace(pathOrLocation, state);
    } else {
      this.memoryHistory.replace(pathOrLocation);
    }
    await this.nextLoad;
  }

  @boundMethod
  @queueMethod
  public async go(count: number): Promise<void> {
    this.memoryHistory.go(count);
    await this.nextLoad;
  }

  @boundMethod
  @queueMethod
  public async pop(): Promise<void> {
    this.memoryHistory.goBack();
    await this.nextLoad;
  }

  @boundMethod
  @queueMethod
  public popTo(): void {
    throw new Error(
      `${History.name}: ${this.popTo.name}() is not implemented for web. Please use push() instead...`
    );
  }

  @boundMethod
  @queueMethod
  public async popToRoot(): Promise<void> {
    await this.push('/', {}, INTERNAL);
  }

  @boundMethod
  @queueMethod
  public async goBack(): Promise<void> {
    this.memoryHistory.goBack();
    await this.nextLoad;
  }

  @boundMethod
  @queueMethod
  public async goForward(): Promise<void> {
    this.memoryHistory.goForward();
    await this.nextLoad;
  }

  @boundMethod
  public block(prompt?: TransitionPromptHook | boolean | string): UnregisterCallback {
    return this.memoryHistory.block(prompt);
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
  public registerResolver(id: string, listener: ResolverListener): UnregisterCallback {
    this.activationObservers.set(id, listener);
    return () => {
      this.activationObservers.delete(id);
    };
  }

  @boundMethod
  public createHref(location: LocationDescriptorObject): string {
    return this.memoryHistory.createHref(location);
  }

  @boundMethod
  public updateTitle(title: RequiredTitle): void {
    document.title = typeof title === 'string' ? title : title.text;
  }
}
