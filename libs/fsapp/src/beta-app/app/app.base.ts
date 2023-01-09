import type { ComponentClass } from 'react';

import { ReactReduxContext } from 'react-redux';

import type { IStore as CargoHoldStore } from '@brandingbrand/cargo-hold';
import type {
  EngagementScreenProps,
  EngagementService,
  EngagementUtilities,
} from '@brandingbrand/engagement-utils';
import { InjectionToken, Injector } from '@brandingbrand/fslinker';
import { FSNetwork } from '@brandingbrand/fsnetwork';

import { boundMethod } from 'autobind-decorator';
import type { Location } from 'history';
import type ReactDOMServer from 'react-dom/server';
import type { Action, Store } from 'redux';
import type { Observable } from 'rxjs';
import {
  BehaviorSubject,
  Subscription,
  combineLatest,
  filter,
  lastValueFrom,
  map,
  take,
} from 'rxjs';

import type { GenericState } from '../legacy/store';
import { StoreManager } from '../legacy/store';
import { FSRouter } from '../router';
import type { FSRouterType, Routes } from '../router';
import { initializeCargoHold } from '../store';

import {
  APIContext,
  API_CONTEXT_TOKEN,
  APP_CONTEXT_TOKEN,
  AppContext,
  REDUX_CONTEXT_TOKEN,
  REDUX_STORE_TOKEN,
} from './context';
import { makeScreenWrapper } from './screen.wrapper';
import type { AppConfig, AppConstructor, AppServerElements, AttributeValue, IApp } from './types';
import { getVersion } from './utils';

export const APP_VERSION_TOKEN = new InjectionToken<string>('APP_VERSION_TOKEN');
export const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>('APP_CONFIG_TOKEN');
export const API_TOKEN = new InjectionToken<FSNetwork>('API_TOKEN');
export const APP_TOKEN = new InjectionToken<IApp>('APP_TOKEN');
export const ENGAGEMENT_SERVICE = new InjectionToken<EngagementService>('ENGAGEMENT_SERVICE');
export const ENGAGEMENT_COMPONENT = new InjectionToken<ComponentClass<EngagementScreenProps>>(
  'ENGAGEMENT_COMPONENT'
);

export abstract class FSAppBase implements IApp {
  public static async bootstrap<S extends GenericState, A extends Action, T extends FSAppBase, C>(
    this: AppConstructor<T>,
    config: AppConfig<S, A, C>
  ): Promise<T> {
    const version = await getVersion(config);
    const { engagement, remote, state } = config;
    const api = remote ? new FSNetwork(remote) : undefined;
    const storeManager = state ? new StoreManager(state) : undefined;
    const store = await storeManager?.getReduxStore(await storeManager.updatedInitialState());
    const cargoHold = config.cargoHold ? initializeCargoHold(config.cargoHold) : undefined;

    const router = await FSRouter.register({
      api,
      shell: config.webShell,
      analytics: config.analytics,
      screenWrap: await makeScreenWrapper({
        store,
        provider: config.provider,
        cargoHold,
      }),
      ...config.router,
    });

    const app = new this(
      version,
      config,
      router,
      api,
      cargoHold,
      store as S extends GenericState ? (A extends Action ? Store<S, A> : undefined) : undefined,
      engagement
    );

    await app.startApplication();
    await app.getProfile();
    return app;
  }

  constructor(
    public readonly version: string,
    public readonly config: AppConfig,
    protected readonly router: FSRouterType,
    public readonly api?: FSNetwork,
    public readonly cargoHold?: CargoHoldStore,
    public readonly store?: Store,
    public readonly engagement?: EngagementUtilities
  ) {
    this.loadInitialState();
    Injector.provide({ provide: APP_TOKEN, useValue: this });
    Injector.provide({ provide: API_TOKEN, useValue: api });
    Injector.provide({ provide: REDUX_STORE_TOKEN, useValue: store });
    Injector.provide({ provide: APP_CONFIG_TOKEN, useValue: config });
    Injector.provide({ provide: APP_VERSION_TOKEN, useValue: version });
    Injector.provide({ provide: API_CONTEXT_TOKEN, useValue: APIContext });
    Injector.provide({ provide: APP_CONTEXT_TOKEN, useValue: AppContext });
    Injector.provide({ provide: REDUX_CONTEXT_TOKEN, useValue: ReactReduxContext });
    Injector.provide({ provide: ENGAGEMENT_SERVICE, useValue: engagement?.engagementService });
    Injector.provide({ provide: ENGAGEMENT_COMPONENT, useValue: engagement?.EngagementComp });
  }

  public readonly injector = Injector;
  public readonly routes: Routes = this.router.routes;
  private readonly isStable = new BehaviorSubject(false);

  protected readonly subscriptions = new Subscription();
  protected readonly initialState = new Map<string, unknown>();
  private readonly serverEffectDependencies = new Map<string, unknown[]>();
  private readonly stableDependencies = new Map<string, Observable<boolean>>();

  protected markStable(): void {
    this.isStable.next(true);
  }

  public shouldRunServerEffect(id: string, dependencies: unknown[]): boolean {
    const currentDependencies = this.serverEffectDependencies.get(id);
    this.serverEffectDependencies.set(id, dependencies);
    return (
      currentDependencies === undefined ||
      dependencies.some((dependency, i) => dependency !== currentDependencies[i])
    );
  }

  public setInitialState(key: string, value: unknown): void {
    this.initialState.set(key, value);
  }

  public getInitialState<T>(key: string): T | undefined {
    return this.initialState.get(key) as T | undefined;
  }

  public dumpInitialState(): Record<string, unknown> {
    return Object.fromEntries(this.initialState.entries());
  }

  public loadInitialState(): void {}

  public addInitialState(id: string, initialData$: Observable<unknown>): void {
    const subscription = initialData$.subscribe({
      next: (value) => {
        this.setInitialState(id, value);
      },
    });

    this.subscriptions.add(subscription);
  }

  public addStableDependency(id: string, stable$: Observable<boolean>): void {
    if (!this.stableDependencies.has(id)) {
      this.stableDependencies.set(id, stable$);
    }
  }

  public async unstable(): Promise<boolean> {
    return lastValueFrom(
      combineLatest([this.isStable, ...this.stableDependencies.values()]).pipe(
        map((dependencies) => !dependencies.every(Boolean)),
        take(1)
      )
    );
  }

  public async stable(): Promise<boolean> {
    return lastValueFrom(
      combineLatest([this.isStable, ...this.stableDependencies.values()]).pipe(
        map((dependencies) => dependencies.every(Boolean)),
        filter((isStable) => isStable),
        take(1)
      )
    );
  }

  public addSubscription(subscription: Subscription): void {
    this.subscriptions.add(subscription);
  }

  @boundMethod
  public async openUrl(url: string): Promise<void> {
    await this.router.open(url);
  }

  @boundMethod
  public async updateProfile(attributeObj: Record<string, AttributeValue>): Promise<boolean> {
    if (!this.engagement?.engagementService) {
      return false;
    }
    // convert to Attribute format expected by engagement api
    const attributes = Object.entries(attributeObj).map(([key, attr]) => ({
      key,
      value: JSON.stringify(attr),
      type: typeof attr,
    }));
    this.store?.dispatch({ type: 'PROFILE_UPDATE', value: attributes });
    return this.engagement.engagementService.setProfileAttributes(attributes);
  }

  @boundMethod
  public async getProfile(accountId?: string): Promise<string | undefined> {
    if (!this.engagement?.engagementService) {
      return undefined;
    }
    return this.engagement.engagementService.getProfile(accountId);
  }

  @boundMethod
  public async updateAccountId(accountId: string): Promise<void> {
    // TODO: implement api route to update user account
  }

  public async fork(location: Partial<Location>, onDestroy: () => void): Promise<this> {
    return (this.constructor as unknown as AppConstructor<this>).bootstrap({
      ...this.config,
      router: {
        ...this.config.router,
        location,
      },
      onDestroy,
    });
  }

  public abstract startApplication(): Promise<void>;
  public abstract stopApplication(): void;

  public abstract getApplication(): AppServerElements;
  public abstract getReactServerDom(): typeof ReactDOMServer;
}
