/* eslint-disable @typescript-eslint/promise-function-async -- Marking the methods as async requires that they return a Promise, but the type from the axios response doesn't quite align with this. */

import { Injector } from '@brandingbrand/fslinker';

import type { AxiosInstance } from 'axios';
import axios from 'axios';

import { AppInterceptorManager } from './app-interceptor.manager';
import type { AppInterceptor } from './app-interceptor.token';
import { APP_INTERCEPTOR } from './app-interceptor.token';
import { HttpContext } from './http-context';
import type { FSNetworkPromise, FSNetworkRequestConfig, FSNetworkRequestData } from './types';

/**
 * Manages network requests, optionally adding a set of default configuration to each request.
 */
export class FSNetwork {
  public static addAppInterceptor(interceptor: AppInterceptor): void {
    Injector.provide({
      provide: APP_INTERCEPTOR,
      useValue: interceptor,
      many: true,
    });
  }

  /**
   * Creates a new instance of FSNetwork.
   *
   * @param config Default configuration to apply to every request.
   */
  constructor(config?: FSNetworkRequestConfig) {
    if (config) {
      const { responseError, responseIntercept, ...axiosConfig } = config;
      this.instance = axios.create(axiosConfig);
      this.setInterceptor(config);
    } else {
      this.instance = axios.create();
    }

    this.appInterceptorManager = new AppInterceptorManager(this.instance);
    this.defaultContext = config?.context ?? new HttpContext();
  }

  private readonly instance: AxiosInstance;
  private readonly appInterceptorManager: AppInterceptorManager;
  private readonly defaultContext: HttpContext;
  private interceptor?: number;

  public removeInterceptor(): void {
    if (this.interceptor !== undefined) {
      this.instance.interceptors.response.eject(this.interceptor);
      this.interceptor = undefined;
    }
  }

  public setInterceptor(config?: FSNetworkRequestConfig): void {
    this.removeInterceptor();
    if (config && (config.responseIntercept || config.responseError)) {
      this.interceptor = this.instance.interceptors.response.use(
        config.responseIntercept,
        config.responseError
      );
    }
  }

  /**
   * Performs a generic request.
   *
   * @param config Configuration for the request.
   * @return A promise of the network response.
   */
  public request<T = any>(config: FSNetworkRequestConfig): FSNetworkPromise<T> {
    config.context = config.context
      ? this.defaultContext.merge(config.context)
      : this.defaultContext;

    return this.instance.request(config);
  }

  /**
   * Performs a GET request.
   *
   * @template T The response data type.
   * @param uri A URI or path to request.
   * @param config Configuration for the request.
   * @return A promise of the network response.
   */
  public get<T = any>(uri: string, config?: FSNetworkRequestConfig): FSNetworkPromise<T> {
    const requestConfig = config ?? {};
    requestConfig.context = requestConfig.context
      ? this.defaultContext.merge(requestConfig.context)
      : this.defaultContext;

    // TODO: caching
    return this.instance.get(uri, requestConfig);
  }

  /**
   * Performs a DELETE request.
   *
   * @param uri A URI or path to request.
   * @param config Configuration for the request.
   * @return A promise of the network response.
   */
  public delete(uri: string, config?: FSNetworkRequestConfig): FSNetworkPromise {
    const requestConfig = config ?? {};
    requestConfig.context = requestConfig.context
      ? this.defaultContext.merge(requestConfig.context)
      : this.defaultContext;

    return this.instance.delete(uri, requestConfig);
  }

  /**
   * Performs a HEAD request.
   *
   * @param uri A URI or path to request.
   * @param config Configuration for the request.
   * @return A promise of the network response.
   */
  public head(uri: string, config?: FSNetworkRequestConfig): FSNetworkPromise {
    const requestConfig = config ?? {};
    requestConfig.context = requestConfig.context
      ? this.defaultContext.merge(requestConfig.context)
      : this.defaultContext;

    return this.instance.head(uri, requestConfig);
  }

  /**
   * Performs a POST request.
   *
   * @template T The response data type.
   * @param uri A URI or path to request.
   * @param data The body of the request.
   * @param config Configuration for the request.
   * @return A promise of the network response.
   */
  public post<T = any>(
    uri: string,
    data?: FSNetworkRequestData,
    config?: FSNetworkRequestConfig
  ): FSNetworkPromise<T> {
    const requestConfig = config ?? {};
    requestConfig.context = requestConfig.context
      ? this.defaultContext.merge(requestConfig.context)
      : this.defaultContext;

    return this.instance.post(uri, data, requestConfig);
  }

  /**
   * Performs a PUT request.
   *
   * @template T The response data type.
   * @param uri A URI or path to request.
   * @param data The body of the request.
   * @param config Configuration for the request.
   * @return A promise of the network response.
   */
  public put<T = any>(
    uri: string,
    data?: FSNetworkRequestData,
    config?: FSNetworkRequestConfig
  ): FSNetworkPromise<T> {
    const requestConfig = config ?? {};
    requestConfig.context = requestConfig.context
      ? this.defaultContext.merge(requestConfig.context)
      : this.defaultContext;

    return this.instance.put(uri, data, requestConfig);
  }

  /**
   * Performs a PATCH request.
   *
   * @template T The response data type.
   * @param uri A URI or path to request.
   * @param data The body of the request.
   * @param config Configuration for the request.
   * @return A promise of the network response.
   */
  public patch<T = any>(
    uri: string,
    data?: FSNetworkRequestData,
    config?: FSNetworkRequestConfig
  ): FSNetworkPromise<T> {
    const requestConfig = config ?? {};
    requestConfig.context = requestConfig.context
      ? this.defaultContext.merge(requestConfig.context)
      : this.defaultContext;

    return this.instance.patch(uri, data, requestConfig);
  }
}

/* eslint-enable @typescript-eslint/promise-function-async */
