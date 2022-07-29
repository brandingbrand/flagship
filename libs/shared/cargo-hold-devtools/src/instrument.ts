import type { IStore } from '@brandingbrand/cargo-hold';
import { InjectionToken, Injector } from '@brandingbrand/fslinker';

import type { StoreDevtoolsOptions } from './config';
import { INITIAL_OPTIONS, STORE_DEVTOOLS_CONFIG, createConfig } from './config';
import { StoreDevtools } from './devtools';
import { DevtoolsDispatcher } from './devtools-dispatcher';
import type { ReduxDevtoolsExtension } from './extension';
import { DevtoolsExtension, REDUX_DEVTOOLS_EXTENSION } from './extension';

export const IS_EXTENSION_OR_MONITOR_PRESENT = new InjectionToken<boolean>(
  '@ngrx/store-devtools Is Devtools Extension or Monitor Present'
);

export const createIsExtensionOrMonitorPresent = Boolean;

export const createReduxDevtoolsExtension = (): ReduxDevtoolsExtension | null => {
  const extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';

  if (typeof window === 'object' && typeof (window as any)[extensionKey] !== 'undefined') {
    return (window as any)[extensionKey];
  }

  return null;
};

export const addDevtools = (store: IStore, options: StoreDevtoolsOptions = {}): void => {
  if (!Injector.has(REDUX_DEVTOOLS_EXTENSION)) {
    Injector.provide({
      provide: REDUX_DEVTOOLS_EXTENSION,
      useFactory: createReduxDevtoolsExtension,
    });
  }

  if (!Injector.has(IS_EXTENSION_OR_MONITOR_PRESENT)) {
    Injector.provide({
      provide: IS_EXTENSION_OR_MONITOR_PRESENT,
      deps: [REDUX_DEVTOOLS_EXTENSION],
      useFactory: createIsExtensionOrMonitorPresent,
    });
  }

  if (!Injector.has(INITIAL_OPTIONS)) {
    Injector.provide({
      provide: INITIAL_OPTIONS,
      useValue: options,
    });
  }

  if (!Injector.has(STORE_DEVTOOLS_CONFIG)) {
    Injector.provide({
      provide: STORE_DEVTOOLS_CONFIG,
      deps: [INITIAL_OPTIONS],
      useFactory: createConfig,
    });
  }

  const DevtoolsDispatcherToken = new InjectionToken<DevtoolsDispatcher>(
    Symbol(DevtoolsDispatcher.name)
  );
  const DevtoolsExtensionToken = new InjectionToken<DevtoolsExtension>(
    Symbol(DevtoolsExtension.name)
  );
  const StoreDevtoolsToken = new InjectionToken<StoreDevtools>(Symbol(StoreDevtools.name));

  Injector.provide({
    provide: DevtoolsDispatcherToken,
    useClass: DevtoolsDispatcher,
  });
  Injector.provide({
    provide: DevtoolsExtensionToken,
    useClass: DevtoolsExtension,
    deps: [REDUX_DEVTOOLS_EXTENSION, STORE_DEVTOOLS_CONFIG, DevtoolsDispatcherToken],
  });
  Injector.provide({
    provide: StoreDevtoolsToken,
    useClass: StoreDevtools,
    deps: [store, DevtoolsDispatcherToken, DevtoolsExtensionToken, STORE_DEVTOOLS_CONFIG],
  });
};
