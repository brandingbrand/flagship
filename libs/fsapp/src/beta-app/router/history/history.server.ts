import { boundMethod } from 'autobind-decorator';
import type {
  Action,
  History as BrowserHistory,
  Location,
  LocationDescriptor,
  TransitionPromptHook,
} from 'history';
import {
  LocationDescriptorObject,
  LocationListener,
  UnregisterCallback,
  createMemoryHistory,
} from 'history';

import { promisedEntries } from '../../utils';
import type { ActivatedRoute, MatchingRoute, Routes } from '../types';

import type { INTERNAL } from './queue.decorator';
import type { FSRouterHistory, HistoryOptions } from './types';
import { LoadingListener, RequiredTitle, ResolverListener } from './types';
import { createKey } from './utils.base';
import type { Matchers } from './utils.base';
import { buildMatchers, matchRoute, resolveRoute, stringifyLocation } from './utils.web';

export class History implements FSRouterHistory {
  constructor(private readonly routes: Routes, protected readonly options?: HistoryOptions) {
    void this.initialNavigation();
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

  private internalAction: Action = this.memoryHistory.action;

  private internalLocation: Location = Object.freeze({
    pathname: '__SPLASH__',
    hash: '',
    search: '',
    state: {},
    key: createKey(),
  });

  public activatedRoute?: ActivatedRoute | undefined;

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
    }
    this.options?.markStable();
  }

  private async activateRoute(
    id: string | undefined,
    matchingRoute: MatchingRoute,
    state: unknown
  ): Promise<void> {
    const activatedRoute = await this.resolveRouteDetails(id, matchingRoute, state);
    this.activatedRoute = activatedRoute;
  }

  private async resolveRouteDetails(
    id: string | undefined,
    matchingRoute: MatchingRoute,
    state: unknown
  ): Promise<ActivatedRoute> {
    const resolvedData = await promisedEntries(resolveRoute(id, matchingRoute));
    return {
      id,
      data: {
        ...resolvedData,
        ...(typeof state === 'object' ? state : {}),
      },
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
  public async open(_to: LocationDescriptor, _state?: unknown): Promise<void> {
    // noop
  }

  public push(path: string, state?: unknown, _internal?: typeof INTERNAL): Promise<void>;
  public push(location: LocationDescriptor, _internal?: typeof INTERNAL): Promise<void>;
  public async push(
    _to: LocationDescriptor,
    _state?: unknown,
    _internal?: typeof INTERNAL
  ): Promise<void> {
    // noop
  }

  public async pushTo(_path: string): Promise<void> {
    // noop
  }

  public replace(path: string, state?: unknown): Promise<void>;
  public replace(location: LocationDescriptor): Promise<void>;
  public async replace(
    _pathOrLocation: LocationDescriptor | string,
    _state?: unknown
  ): Promise<void> {
    // noop
  }

  public async go(_count: number): Promise<void> {
    // noop
  }

  public async pop(): Promise<void> {
    // noop
  }

  public popTo(): void {
    // noop
  }

  public async popToRoot(): Promise<void> {
    // noop
  }

  public async goBack(): Promise<void> {
    // noop
  }

  public async goForward(): Promise<void> {
    // noop
  }

  public block(_prompt?: TransitionPromptHook | boolean | string): UnregisterCallback {
    return () => {};
  }

  @boundMethod
  public listen(_listener: LocationListener): UnregisterCallback {
    return () => {};
  }

  @boundMethod
  public observeLoading(_listener: LoadingListener): UnregisterCallback {
    return () => {};
  }

  @boundMethod
  public registerResolver(_id: string, _listener: ResolverListener): UnregisterCallback {
    return () => {};
  }

  @boundMethod
  public createHref(location: LocationDescriptorObject): string {
    return this.memoryHistory.createHref(location);
  }

  @boundMethod
  public updateTitle(_title: RequiredTitle): void {
    // noop
  }
}
