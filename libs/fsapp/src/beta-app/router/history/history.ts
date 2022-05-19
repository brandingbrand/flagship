import { Linking, Platform } from 'react-native';
import type { AnimationOptions, LayoutTabsChildren } from 'react-native-navigation';
import { Navigation } from 'react-native-navigation';

import type { DeepPartial } from '@brandingbrand/types-utility';

import { boundMethod } from 'autobind-decorator';
import isEqual from 'fast-deep-equal';
import {
  LocationDescriptor,
  LocationDescriptorObject,
  LocationListener,
  UnregisterCallback,
  parsePath,
} from 'history';
import type { Action, Location, TransitionPromptHook } from 'history';
import { findLastIndex, isString, uniqueId } from 'lodash-es';

import { isDefined, promisedEntries } from '../../utils';
import { StackedLocationDescriptor } from '../types';
import type {
  ActivatedRoute,
  IndexedComponentRoute,
  MatchingRoute,
  RedirectRoute,
  RouteParams,
  Routes,
  ScreenComponentType,
} from '../types';

import { ROOT_STACK } from './constants';
import { INTERNAL, queueMethod } from './queue.decorator';
import type { Blocker, FSRouterHistory, HistoryOptions, Stack, StackedLocation } from './types';
import { LoadingListener, RequiredTitle, ResolverListener } from './types';
import { normalizeLocationDescriptor } from './utils.base';
import type { Matchers } from './utils.base';
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
  stringifyLocation,
} from './utils.native';

export class History implements FSRouterHistory {
  constructor(private readonly routes: Routes, protected readonly options?: HistoryOptions) {
    this.observeNavigation();
    const tabRoutes = this.routes.filter(isTabRoute);
    const universalRoutes = this.routes.filter(isNotTabRoute);
    const stackMatchers = tabRoutes.map(async ({ children, tab }) => buildMatchers(children, tab));

    const promisedStacks = tabRoutes.map(async (route, i) =>
      matchStack(
        route,
        stackMatchers[i] as Promise<
          Array<
            readonly [
              (checkPath: string) =>
                | {
                    params: RouteParams;
                  }
                | undefined,
              IndexedComponentRoute | RedirectRoute
            ]
          >
        >
      )
    );

    void Promise.all(promisedStacks)
      .then(async (awaitedStacks) => {
        const resolvedStacks = awaitedStacks.filter(isDefined);
        const root = await makeRootLayout(resolvedStacks, async () =>
          matchStack({ children: universalRoutes }, this.matchers)
        );

        const activatedPaths = extractPagePaths(root).filter(isDefined).filter(isString);

        const stacks: LayoutTabsChildren[] | undefined = root.bottomTabs
          ? root.bottomTabs.children
          : [
              ...(root.stack?.id
                ? ([
                    {
                      component: {
                        // TODO: Figure out Root Stack
                        // id: root.stack.id,
                        // name: root.stack.id
                      },
                    },
                  ] as LayoutTabsChildren[])
                : []),
            ];

        const partialStacks: Array<DeepPartial<Stack>> = [
          ...(stacks ?? []).map((layout, i) => ({
            id: layout.stack?.id,
            children: [
              {
                ...parsePath(activatedPaths[i] as string),
                key: activatedPaths[i],
                layout: layout.stack?.children?.[0],
              },
            ],
          })),
        ];

        const requiredStacks = partialStacks.filter((stack): stack is Required<Stack> =>
          Boolean(stack.id)
        );

        this.stacks.push(...requiredStacks);
        this.store.push(
          ...this.stacks.flatMap((stack, i) =>
            stack.children.map((location) => ({ ...location, stack: i }))
          )
        );

        this.activeStack = 0;
        this.activeIndex = this.store.length - 1;
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            const activations = activatedPaths.map(async (path) => {
              const matchingRoute = await matchRoute(this.matchers, path);
              if (matchingRoute) {
                const activatedRoute = await this.resolveRouteDetails(
                  matchingRoute.id,
                  matchingRoute
                );
                const observer = this.activationObservers.get(matchingRoute.id);
                observer?.(activatedRoute);
                return [matchingRoute, activatedRoute] as const;
              }

              return [undefined, undefined] as const;
            });

            Promise.all(activations)
              .then(async (activated) => {
                await Navigation.setRoot(await activateStacks(root, activated));
              })
              .then(resolve)
              .catch(reject);
          });
        });
      })
      .catch();
  }

  private readonly matchers: Matchers = buildMatchers(this.routes);
  private readonly actions: Action[] = [];

  private activeIndex = -1;
  private readonly store: StackedLocation[] = [];

  private activeStack = -1;
  private readonly stacks: Array<Readonly<Stack>> = [];

  private readonly blockers: Map<string, Blocker> = new Map();
  private readonly activationObservers: Map<string, ResolverListener> = new Map();
  private readonly lactationObservers: Map<string, LocationListener> = new Map();
  private readonly loadingObservers: Map<string, LoadingListener> = new Map();

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

  private async waitForNextLoadOf(location: Location): Promise<void> {
    if (this.location.pathname === location.pathname) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      let timeout: Parameters<typeof clearTimeout>[0] | undefined;
      if (Platform.OS === 'ios') {
        timeout = setTimeout(() => {
          reject();
        }, 3000);
      }

      const remove = this.listen((update) => {
        if (update.pathname === location.pathname) {
          if (timeout) {
            clearTimeout(timeout);
          }

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
    Navigation.events().registerComponentDidAppearListener(({ componentId }) => {
      const index = this.getKeyIndexInHistory(componentId);
      if (index !== -1) {
        this.activeIndex = index;
        for (const callback of this.lactationObservers.values()) {
          callback(this.location, this.action);
        }
      }
    });

    Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex }) => {
      this.activeStack = selectedTabIndex;
    });

    Navigation.events().registerBottomTabPressedListener(({ tabIndex }) => {
      if (tabIndex === this.activeStack && this.stack) {
        void Navigation.popToRoot(this.stack.id)
          .then(() => {
            this.stack?.children.splice(1);
          })
          .catch();
      }
    });

    Navigation.events().registerScreenPoppedListener(() => {
      setTimeout(() => {
        if (this.location.key) {
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
    state: unknown = null,
    stackAffinity = false
  ): Promise<StackedLocation> {
    return Object.freeze({
      ...this.location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      stack: stackAffinity
        ? (typeof to === 'object' && 'stack' in to
            ? to.stack
            : await this.getStackAffinity(stringifyLocation(to))) ?? this.activeStack
        : this.activeStack,
      state,
      key: createKey(),
    });
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity, max-statements
  private async updateLocation(location: StackedLocation, action: Action): Promise<void> {
    const baseOptions = (
      matchingRoute: MatchingRoute,
      componentOptions: ScreenComponentType,
      title: string | undefined,
      animationOptions?: AnimationOptions
    ) => ({
      component: {
        name: matchingRoute.id,
        id: location.key,

        options: {
          animations: animationOptions,
          topBar: {
            rightButtons: undefined,
            leftButtons: undefined,
            ...matchingRoute.topBarStyle,
            ...componentOptions.buttons,
            title: {
              ...matchingRoute.topBarStyle?.title,
              text: title,
            },
          },
        },
      },
    });

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
      this.actions.push(action);
      const matchingRoute = await matchRoute(this.matchers, stringifyLocation(location));
      switch (action) {
        case 'PUSH':
          if (
            matchingRoute &&
            (!this.location || stringifyLocation(this.location) !== matchingRoute.matchedPath)
          ) {
            this.setLoading(true);
            const activatedRoute = await this.resolveRouteDetails(location.key, {
              ...matchingRoute,
              data: {
                ...matchingRoute.data,
                ...(typeof location.state === 'object' ? location.state : {}),
              },
            });
            const observer = this.activationObservers.get(matchingRoute.id);
            observer?.(activatedRoute);

            const title =
              typeof matchingRoute.title === 'function'
                ? await matchingRoute.title(activatedRoute)
                : matchingRoute.title;

            const componentOptions =
              'component' in matchingRoute
                ? matchingRoute.component
                : await matchingRoute.loadComponent(activatedRoute);

            const options = baseOptions(matchingRoute, componentOptions, title);

            this.store.push(location);
            this.activeIndex = this.store.length - 1;
            this.stacks[location.stack]?.children.push({ ...location, layout: options });

            if (this.activeStack !== location.stack) {
              void this.switchStack(location.stack);
              this.activeStack = location.stack;
            }

            if (Platform.OS === 'ios') {
              void Navigation.push(this.stack?.id ?? ROOT_STACK, options);
            } else {
              await Navigation.push(this.stack?.id ?? ROOT_STACK, options);
            }
          }
          break;

        case 'REPLACE':
          if (
            matchingRoute && // if the location is NOT the same as the previous one.
            (!this.location || stringifyLocation(this.location) !== matchingRoute.matchedPath)
          ) {
            this.setLoading(true);
            const activatedRoute = await this.resolveRouteDetails(location.key, {
              ...matchingRoute,
              data: {
                ...matchingRoute.data,
                ...(typeof location.state === 'object' ? location.state : {}),
              },
            });
            const observer = this.activationObservers.get(matchingRoute.id);
            observer?.(activatedRoute);

            const title =
              typeof matchingRoute.title === 'function'
                ? await matchingRoute.title(activatedRoute)
                : matchingRoute.title;

            this.store[this.activeIndex] = location;

            const componentOptions =
              'component' in matchingRoute
                ? matchingRoute.component
                : await matchingRoute.loadComponent(activatedRoute);

            const layout = baseOptions(matchingRoute, componentOptions, title, {
              setStackRoot: {
                enabled: false,
              },
            });

            // this.stack[location.stack] - refers to current main stack, should just be able to pop and push
            this.stacks[location.stack]?.children.pop();
            this.stacks[location.stack]?.children.push({ ...location, layout });

            const otherLayout = this.stack?.children.slice(0, -1).map(({ layout }) => layout) ?? [];

            if (Platform.OS === 'ios') {
              void Navigation.setStackRoot(this.stack?.id ?? ROOT_STACK, [...otherLayout, layout]);
            } else {
              await Navigation.setStackRoot(this.stack?.id ?? ROOT_STACK, [...otherLayout, layout]);
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
              stringifyLocation(location),
              location.state
            );
            this.stacks[location.stack]?.children.splice(indexInStack + 1);

            if (this.activeStack !== location.stack) {
              void this.switchStack(location.stack);
              this.activeStack = location.stack;
            }

            if (Platform.OS === 'ios') {
              void Navigation.popTo(location.key);
            } else {
              await Navigation.popTo(location.key);
            }
          }
          break;

        default:
      }
      await nextLoad;
    } finally {
      this.setLoading(false);
    }
  }

  private async resolveRouteDetails(
    id: string | undefined,
    matchingRoute: MatchingRoute
  ): Promise<ActivatedRoute> {
    const resolvedData = await promisedEntries(resolveRoute(id, matchingRoute));
    return {
      id,
      data: resolvedData,
      query: matchingRoute.query,
      params: matchingRoute.params,
      url: matchingRoute.matchedPath,
      path: matchingRoute.path,
      isExact: matchingRoute.path === matchingRoute.matchedPath,
      loading: true,
    };
  }

  private async getStackAffinity(path: string): Promise<number | undefined> {
    const route = await matchRoute(this.matchers, path);
    return route?.tabAffinity ? this.getStack(route.tabAffinity) : undefined;
  }

  private getStack(stack: number | string): number {
    return typeof stack === 'number' ? stack : this.stacks.findIndex(({ id }) => stack === id);
  }

  private getKeyIndexInHistory(key: string): number {
    return findLastIndex(this.store, (pastLocation) => key === pastLocation.key);
  }

  private getPathIndexInHistory(path: string, state: unknown): number {
    return findLastIndex(
      this.store,
      (pastLocation) =>
        path === stringifyLocation(pastLocation) && isEqual(pastLocation.state, state)
    );
  }

  private getPathIndexInStack(stack: number, path: string, state: unknown): number {
    return findLastIndex(
      this.stacks[stack]?.children,
      (pastLocation) =>
        path === stringifyLocation(pastLocation) && isEqual(pastLocation.state, state)
    );
  }

  private getKeyIndexInStack(stack: number, key: string): number {
    return findLastIndex(this.stacks[stack]?.children, (pastLocation) => key === pastLocation.key);
  }

  private async switchStack(stack: number | string): Promise<void> {
    const potentialTab = this.getStack(stack);
    const updatedTab = potentialTab !== -1 ? potentialTab : this.activeStack;
    Navigation.mergeOptions(ROOT_STACK, {
      bottomTabs: {
        currentTabIndex: updatedTab,
      },
    });

    return new Promise((resolve) => {
      if (updatedTab === this.activeStack) {
        resolve();
        return;
      }

      const observer = Navigation.events().registerComponentDidAppearListener(() => {
        this.activeStack = updatedTab;
        resolve();
        observer.remove();
      });
    });
  }

  private checkBlockers(location: Location, action: Action): boolean {
    return [...this.blockers.values()].some((blocker) => {
      if (typeof blocker === 'function') {
        return blocker(location, action);
      }

      return blocker;
    });
  }

  private setLoading(loading: boolean): void {
    for (const callback of this.loadingObservers.values()) {
      callback(loading);
    }
  }

  public open(path: string, state?: unknown): Promise<void>;
  public open(location: LocationDescriptor): Promise<void>;
  @boundMethod
  @queueMethod
  public async open(to: LocationDescriptor, state?: unknown): Promise<void> {
    const normalized = normalizeLocationDescriptor(to);
    const path = stringifyLocation(normalized);
    const index = this.getPathIndexInHistory(path, state);
    const indexInStack = this.getPathIndexInStack(
      (await this.getStackAffinity(path)) ?? this.activeStack,
      path,
      state
    );

    await (indexInStack !== -1
      ? this.go(index - this.activeIndex, INTERNAL)
      : this.push(path, state, INTERNAL));
  }

  public push(path: string, state?: unknown, _internal?: typeof INTERNAL): Promise<void>;
  public push(location: StackedLocationDescriptor, _internal?: typeof INTERNAL): Promise<void>;
  @boundMethod
  @queueMethod
  public async push(
    to: StackedLocationDescriptor,
    state?: unknown | typeof INTERNAL,
    _internal?: typeof INTERNAL
  ): Promise<void> {
    const normalized = normalizeLocationDescriptor(to);
    if (normalized.pathname && /^\w+:\/\//.test(normalized.pathname)) {
      await Linking.openURL(normalized.pathname);
    } else {
      const newLocation = await this.getNextLocation(normalized, state, _internal !== undefined);
      await this.updateLocation(newLocation, 'PUSH');
    }
  }

  @boundMethod
  @queueMethod
  public async pushTo(path: string, screenId: string): Promise<void> {
    const targetStack = this.stacks.findIndex(({ children }) =>
      children.some(({ key }) => screenId === key)
    );

    const location = normalizeLocationDescriptor(path);
    if (targetStack) {
      await this.push({ ...location, stack: targetStack }, INTERNAL);
    }
  }

  public replace(path: string, state?: unknown): Promise<void>;
  public replace(location: LocationDescriptor): Promise<void>;
  @boundMethod
  @queueMethod
  public async replace(_to: LocationDescriptor, _state?: unknown): Promise<void> {
    const normalized = normalizeLocationDescriptor(_to);
    if (normalized.pathname && /^\w+:\/\//.test(normalized.pathname)) {
      await Linking.openURL(normalized.pathname);
    } else {
      const newLocation = await this.getNextLocation(normalized, _state, INTERNAL !== undefined);
      await this.updateLocation(newLocation, 'REPLACE');
    }
  }

  @boundMethod
  @queueMethod
  public async pop(): Promise<void> {
    const stack = this.stack?.children ?? [];
    const previousStack = stack[stack.length - 2];
    if (!previousStack) {
      return;
    }
    const newLocation = {
      stack: this.activeStack,
      ...previousStack,
    };

    await this.updateLocation(newLocation, 'POP');
  }

  @boundMethod
  @queueMethod
  public async popTo(screenId: string): Promise<void> {
    const screen = this.stacks
      .flatMap(({ children }, stack) => children.map((location) => ({ ...location, stack })))
      .find(({ key }) => key === screenId);

    if (screen) {
      await this.updateLocation(screen, 'POP');
    }
  }

  @boundMethod
  @queueMethod
  public async popToRoot(): Promise<void> {
    const root = this.stack?.children[0];

    if (root) {
      await this.updateLocation({ ...root, stack: this.activeStack }, 'POP');
    }
  }

  @boundMethod
  @queueMethod
  public async go(n: number, _internal?: typeof INTERNAL): Promise<void> {
    if (n === 0) {
      return;
    }

    const newLocation = this.store[this.activeIndex + n];
    if (newLocation?.key) {
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
  public block(prompt?: TransitionPromptHook | boolean | string): UnregisterCallback {
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
                  text: title,
                }
              : title,
        },
      });
    }
  }
}
