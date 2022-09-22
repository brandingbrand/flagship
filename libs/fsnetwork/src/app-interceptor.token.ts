import { InjectionToken } from '@brandingbrand/fslinker';

import type { FSNetworkPromise, FSNetworkRequestConfig } from './types';

export type NextCallback = (config: FSNetworkRequestConfig) => FSNetworkPromise;

export type AppInterceptor = (
  config: FSNetworkRequestConfig,
  next: NextCallback
) => FSNetworkPromise;

export const APP_INTERCEPTOR = new InjectionToken<AppInterceptor, 'many'>('APP_INTERCEPTOR');
