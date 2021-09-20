import type {
  Blocker,
  FSRouterHistory,
  LoadingListener,
  RequiredTitle,
  ResolverListener,
  Stack,
  StackedLocation
} from './types';

import { Linking, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';

import { boundMethod } from 'autobind-decorator';
import {
  Action,
  Location,
  LocationDescriptor,
  LocationDescriptorObject,
  LocationListener,
  parsePath,
  TransitionPromptHook,
  UnregisterCallback
} from 'history';
import { findLastIndex, isString, uniqueId } from 'lodash-es';

import { ActivatedRoute, MatchingRoute, Routes } from '../types';
import { isDefined, promisedEntries } from '../../utils';

import { INTERNAL, queueMethod } from './queue.decorator';
import {
  activateStacks,
  buildMatchers,
  createKey,
  extractPagePaths,
  isNotTabRoute,
  isTabRoute,
  makeRootLayout,
  matchRoute,
  matchStack,
  resolveRoute,
  stringifyLocation
} from './utils.native';
import { Matchers, normalizeLocationDescriptor } from './utils.base';
import { ROOT_STACK } from './constants';

export class History implements FSRouterHistory {
  public get stack(): Stack | undefined {
    return this.stacks[this.activeStack];
  }

  public get action(): Action {
    return this.actions[this.actions.length - 1] ?? 'PUSH';
  }

  public get location(): Location {
    return this.store[this.activeIndex] ?? parsePath('');
  }

  public readonly length: number = 50;

  private readonly matchers: Matchers = buildMatchers(this.routes);
  private readonly actions: Action[] = [];

  private activeIndex: number = -1;
  private readonly store: StackedLocation[] = [];

  private activeStack: number = -1;
  private readonly stacks: Readonly<Stack>[] = [];

  private readonly blockers: Map<string, Blocker> = new Map();
  private readonly activationObservers: Map<string, ResolverListener> = new Map();
  private readonly lactationObservers: Map<string, LocationListener> = new Map();
  private readonly loadingObservers: Map<string, LoadingListener> = new Map();

  constructor(private readonly routes: Routes) {
    this.observeNavigation();
    const tabRoutes = this.routes.filter(isTabRoute);
    const universalRoutes = this.routes.filter(isNotTabRoute);
    const stackMatchers = tabRoutes.map(({ children, tab }) =>
      buildMatchers(children, tab)
    );

    const promisedStacks = tabRoutes.map((route, i) => matchStack(route, stackMatchers[i]));

    Promise.all(promisedStacks)
      .then(async awaitedStacks => {
        const resolvedStacks = awaitedStacks.filter(isDefined);
        const root = await makeRootLayout(resolvedStacks, () =>
          matchStack({ children: universalRoutes }, this.matchers)
        );

        const activatedPaths = extractPagePaths(root).filter(isDefined).filter(isString);

        const stacks = root.bottomTabs
          ? root.bottomTabs.children?.map(({ stack }) => stack?.id)
          : [root.stack?.id];

        this.stacks.push(
          ...(stacks ?? []).filter(isDefined).map((id, i) => ({
            id,
            children: [{ ...parsePath(activatedPaths[i]), key: activatedPaths[i] }]
          }))
        );
        this.store.push(
          ...this.stacks
            .map((stack, i) => stack.children.map(location => ({ ...location, stack: i })))
            .reduce((prev, next) => [...prev, ...next], [])
        );

        this.activeStack = 0;
        this.activeIndex = this.store.length - 1;
        setTimeout(async () => {
          const activations = activatedPaths.map(async path => {
            const matchingRoute = await matchRoute(this.matchers, path);
            if (matchingRoute) {
              const activatedRoute = await this.resolveRouteDetails(matchingRoute);
              const observer = this.activationObservers.get(matchingRoute.id);
              observer?.(activatedRoute);
              return [matchingRoute, activatedRoute] as const;
            }

            return [undefined, undefined] as const;
          });

          const activated = await Promise.all(activations);

          await Navigation.setRoot(await activateStacks(root, activated));
        });
      })
      .catch();
  }

  public open(path: string, state?: unknown): Promise<void>;
  public open(location: LocationDescriptor): Promise<void>;
  @boundMethod
  @queueMethod
  public async open(to: LocationDescriptor, state?: unknown): Promise<void> {
    const normalized = normalizeLocationDescriptor(to);
    const path = stringifyLocation(normalized);
    const index = this.getPathIndexInHistory(path);
    const indexInStack = this.getPathIndexInStack(
      (await this.getStackAffinity(path)) ?? this.activeStack,
      path
    );

    if (indexInStack !== -1) {
      await this.go(index - this.activeIndex, INTERNAL);
    } else {
      await this.push(path, state, INTERNAL);
    }
  }

  public push(path: string, state?: unknown, _internal?: typeof INTERNAL): Promise<void>;
  public push(location: LocationDescriptor): Promise<void>;
  @boundMethod
  @queueMethod
  public async push(
    to: LocationDescriptor,
    state?: unknown,
    _internal?: typeof INTERNAL
  ): Promise<void> {
    const normalized = normalizeLocationDescriptor(to);
    if (normalized.pathname && /^\w+:\/\//.exec(normalized.pathname)) {
      await Linking.openURL(normalized.pathname);
    } else {
      const newLocation = await this.getNextLocation(normalized, state);
      await this.updateLocation(newLocation, 'PUSH');
    }
  }

  public replace(path: string, state?: unknown): Promise<void>;
  public replace(location: LocationDescriptor): Promise<void>;
  @boundMethod
  @queueMethod
  public async replace(_to: LocationDescriptor, _state?: unknown): Promise<void> {
    throw new Error('Native routes cannot be replaced.');
  }

  @boundMethod
  @queueMethod
  public async pop(): Promise<void> {
    const stack = this.stack?.children ?? [];
    const newLocation = {
      stack: this.activeStack,
      ...stack[stack.length - 2]
    };

    await this.updateLocation(newLocation, 'POP');
  }

  @boundMethod
  @queueMethod
  public async go(n: number, _internal?: typeof INTERNAL): Promise<void> {
    if (n === 0) {
      return;
    }

    const newLocation = this.store[this.activeIndex + n];
    if (newLocation.key) {
      const inStack = this.getKeyIndexInStack(newLocation.stack, newLocation.key) !== -1;
      await this.updateLocation(newLocation, inStack ? 'POP' : 'PUSH');
    }
  }

  @boundMethod
  @queueMethod
  public async goBack(): Promise<void> {
    return this.go(-1, INTERNAL);
  }

  @boundMethod
  @queueMethod
  public async goForward(): Promise<void> {
    return this.go(1, INTERNAL);
  }

  @boundMethod
  public block(prompt?: string | boolean | TransitionPromptHook): UnregisterCallback {
    const id = uniqueId('blocker');
    this.blockers.set(id, prompt ?? true);

    return () => {
      this.blockers.delete(id);
    };
  }

  @boundMethod
  public listen(listener: LocationListener): UnregisterCallback {
    const id = uniqueId('subscriber');
    this.lactationObservers.set(id, listener);

    return () => {
      this.lactationObservers.delete(id);
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
    return stringifyLocation(location);
  }

  @queueMethod
  public async updateTitle(title: RequiredTitle, componentId?: string): Promise<void> {
    const key = componentId ?? this.location.key;
    if (key) {
      Navigation.mergeOptions(key, {
        topBar: {
          title:
            typeof title === 'string'
              ? {
                text: title
              }
              : title
        }
      });
    }
  }

  private async waitForNextLoadOf(location: Location): Promise<void> {
    if (this.location.pathname === location.pathname) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      const remove = this.listen(update => {
        if (update.pathname === location.pathname) {
          if (Platform.OS === 'ios') {
            // For whatever reason the Navigation
            // is not ready for further navigations
            // for a small delay
            setTimeout(() => {
              resolve();
              remove();
            }, 10);
          } else {
            setTimeout(() => {
              resolve();
              remove();
            });
          }
        }
      });
    });
  }

  private observeNavigation(): void {
    Navigation.events().registerComponentDidAppearListener(async ({ componentId }) => {
      const index = this.getKeyIndexInHistory(componentId);
      if (index !== -1) {
        this.activeIndex = index;
        this.lactationObservers.forEach(callback => callback(this.location, this.action));
      }
    });

    Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex }) => {
      this.activeStack = selectedTabIndex;
    });

    Navigation.events().registerBottomTabPressedListener(({ tabIndex }) => {
      if (tabIndex === this.activeStack) {
        if (this.stack) {
          Navigation.popToRoot(this.stack.id)
            .then(() => {
              this.stack?.children.splice(1);
            })
            .catch();
        }
      }
    });

    Navigation.events().registerScreenPoppedListener(() => {
      setTimeout(() => {
        if (this.location?.key) {
          const index = this.getKeyIndexInStack(this.activeStack, this.location.key);
          if (index !== -1) {
            this.stack?.children.splice(index + 1);
          }
        }
      });
    });
  }

  private async getNextLocation(
    to: LocationDescriptor | StackedLocation,
    state: unknown = null
  ): Promise<StackedLocation> {
    return Object.freeze({
      ...this.location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      stack:
        (typeof to === 'object' && 'stack' in to
          ? to.stack
          : await this.getStackAffinity(stringifyLocation(to))) ?? this.activeStack,
      state,
      key: createKey()
    });
  }

  // tslint:disable-next-line: cyclomatic-complexity
  private async updateLocation(location: StackedLocation, action: Action): Promise<void> {
    if (this.checkBlockers(location, action)) {
      return;
    }

    if (this.actions.length >= this.length) {
      this.actions.shift();
    }

    if (this.store.length >= this.length) {
      this.store.unshift();
    }

    const nextLoad = this.waitForNextLoadOf(location);
    try {
      if (this.activeStack !== location.stack) {
        await this.switchStack(location.stack);
      }

      this.actions.push(action);
      switch (action) {
        case 'PUSH':
          const matchingRoute = await matchRoute(this.matchers, stringifyLocation(location));
          if (matchingRoute) {
            if (!this.location || stringifyLocation(this.location) !== matchingRoute.matchedPath) {
              this.setLoading(true);
              const activatedRoute = await this.resolveRouteDetails({
                ...matchingRoute,
                data: {
                  ...matchingRoute.data,
                  ...(typeof location.state === 'object' ? location.state : {})
                }
              });
              const observer = this.activationObservers.get(matchingRoute.id);
              observer?.(activatedRoute);

              const title =
                typeof matchingRoute.title === 'function'
                  ? await matchingRoute.title(activatedRoute)
                  : matchingRoute.title;

              this.store.push(location);
              this.activeIndex = this.store.length - 1;
              this.stacks[location.stack].children.push(location);
              const componentOptions =
                'component' in matchingRoute
                  ? matchingRoute.component
                  : await matchingRoute.loadComponent(activatedRoute);

              await Navigation.push(this.stack?.id ?? ROOT_STACK, {
                component: {
                  name: matchingRoute.id,
                  id: location.key,
                  options: {
                    topBar: {
                      rightButtons: undefined,
                      leftButtons: undefined,
                      ...matchingRoute.topBarStyle,
                      ...componentOptions.buttons,
                      title: {
                        ...matchingRoute.topBarStyle?.title,
                        text: title
                      }
                    }
                  }
                }
              });
            }
          }

          break;
        case 'POP':
          if (
            location.key &&
            (!this.location || stringifyLocation(this.location) !== stringifyLocation(location))
          ) {
            const indexInStack = this.getPathIndexInStack(
              location.stack,
              stringifyLocation(location)
            );
            this.stacks[location.stack].children.splice(indexInStack + 1);
            await Navigation.popTo(location.key);
          }
          break;

        default:
      }
      await nextLoad;
    } finally {
      this.setLoading(false);
    }
  }

  private async resolveRouteDetails(matchingRoute: MatchingRoute): Promise<ActivatedRoute> {
    const resolvedData = await promisedEntries(resolveRoute(matchingRoute));
    return {
      data: resolvedData,
      query: matchingRoute.query,
      params: matchingRoute.params,
      path: matchingRoute.matchedPath,
      loading: true
    };
  }

  private async getStackAffinity(path: string): Promise<number | undefined> {
    const route = await matchRoute(this.matchers, path);
    return route?.tabAffinity ? this.getStack(route.tabAffinity) : undefined;
  }

  private getStack(stack: string | number): number {
    return typeof stack === 'number' ? stack : this.stacks.findIndex(({ id }) => stack === id);
  }

  private getKeyIndexInHistory(key: string): number {
    return findLastIndex(this.store, pastLocation => key === pastLocation.key);
  }

  private getPathIndexInHistory(path: string): number {
    return findLastIndex(this.store, pastLocation => path === stringifyLocation(pastLocation));
  }

  private getPathIndexInStack(stack: number, path: string): number {
    return findLastIndex(
      this.stacks[stack].children, pastLocation => path === stringifyLocation(pastLocation)
    );
  }

  private getKeyIndexInStack(stack: number, key: string): number {
    return findLastIndex(this.stacks[stack].children, pastLocation => key === pastLocation.key);
  }

  private async switchStack(stack: number | string): Promise<void> {
    const potentialTab = this.getStack(stack);
    const updatedTab = potentialTab !== -1 ? potentialTab : this.activeStack;
    Navigation.mergeOptions(ROOT_STACK, {
      bottomTabs: {
        currentTabIndex: updatedTab
      }
    });

    return new Promise(resolve => {
      if (updatedTab === this.activeStack) {
        return resolve();
      }

      const observer = Navigation.events().registerComponentDidAppearListener(() => {
        this.activeStack = updatedTab;
        resolve();
        observer.remove();
      });
    });
  }

  private checkBlockers(location: Location, action: Action): boolean {
    return [...this.blockers.values()].some(blocker => () => {
      if (typeof blocker === 'function') {
        return blocker(location, action);
      } else {
        return blocker;
      }
    });
  }

  private setLoading(loading: boolean): void {
    this.loadingObservers.forEach(callback => callback(loading));
  }
}
