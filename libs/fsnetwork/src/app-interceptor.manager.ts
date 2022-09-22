import { Injector } from '@brandingbrand/fslinker';

import type { AxiosInstance, AxiosResponse } from 'axios';

import type { NextCallback } from './app-interceptor.token';
import { APP_INTERCEPTOR } from './app-interceptor.token';
import type { FSNetworkPromise, FSNetworkRequestConfig, FSNetworkResponse } from './types';

export class AppInterceptorManager {
  constructor(instance: AxiosInstance) {
    instance.interceptors.request.use(this.requestInterceptor.bind(this));
    instance.interceptors.response.use(this.responseInterceptor.bind(this));
  }

  private readonly requests = new WeakMap<
    FSNetworkRequestConfig,
    (response: FSNetworkResponse) => FSNetworkPromise
  >();

  private async requestInterceptor(
    config: FSNetworkRequestConfig
  ): Promise<FSNetworkRequestConfig> {
    const interceptors = Injector.getMany(APP_INTERCEPTOR);

    // Resolving this config starts the request
    return new Promise((resolveConfig) => {
      const finalResponsePromise = new Promise<FSNetworkResponse>((resolveFinalResponse) => {
        // Creates a stack of interceptors like interceptor1(interceptor2(interceptor3))
        // eslint-disable-next-line unicorn/no-array-reduce -- Used to combine functions
        const start = interceptors.reduceRight<NextCallback>(
          (aggregate, interceptor) => async (interceptedConfig) =>
            interceptor(interceptedConfig, aggregate),
          // Inner layer
          async (finalizedConfig) =>
            new Promise<FSNetworkResponse>((resolveOriginalResponse) => {
              // Connects finalized config to callback for response to be used by the
              // responseInterceptor
              this.requests.set(finalizedConfig, async (originalResponse) => {
                resolveOriginalResponse(originalResponse);

                // Waits for all the interceptors to modify the response
                // before sending back to responseInterceptor
                return finalResponsePromise;
              });

              // Starts actual request with finalized config
              resolveConfig(finalizedConfig);
            })
        );

        const interceptedResponse = start(config);
        resolveFinalResponse(interceptedResponse);
      });
    });
  }

  private async responseInterceptor(response: AxiosResponse): Promise<AxiosResponse> {
    const callback = this.requests.get(response.config);

    return callback?.(response as FSNetworkResponse) ?? response;
  }
}
