/* eslint-disable @typescript-eslint/promise-function-async */
import type {
  AxiosError,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import axios from 'axios';

// Export AxiosResponse type so its type definitions are not "private" and other packages depending
// on FSNetwork can use our type aliases

// As of Axios 0.18, the typings don't show the Axios property even though it exists

/**
 * Error response object from the network.
 */
export type FSNetworkError = AxiosError;

/**
 * Configuration for the network request.
 *
 * @see https://github.com/axios/axios#request-config
 */
export interface FSNetworkRequestConfig extends AxiosRequestConfig {
  // Function that is called to intercept any responses
  responseIntercept?: (response: AxiosResponse) => AxiosResponse;
  // Function that is called to intercept any response errors
  responseError?: (error: FSNetworkError) => FSNetworkError;
}

/**
 * A promise of a response from the network.
 *
 * @see https://github.com/axios/axios#response-schema
 */
export type FSNetworkPromise<T = any> = AxiosPromise<T>;

/**
 * A response object from the network.
 *
 * @see https://github.com/axios/axios#response-schema
 */
export type FSNetworkResponse<T = any> = AxiosResponse<T>;

/**
 * The body of a network equest.
 */
export type FSNetworkRequestData =
  | ArrayBuffer
  | ArrayBufferView
  | Record<string, any>
  | URLSearchParams
  | string;

/**
 * Manages network requests, optionally adding a set of default configuration to each request.
 */
export class FSNetwork {
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
  }

  private readonly instance: AxiosInstance;
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
    // TODO: caching
    return this.instance.get(uri, config);
  }

  /**
   * Performs a DELETE request.
   *
   * @param uri A URI or path to request.
   * @param config Configuration for the request.
   * @return A promise of the network response.
   */
  public delete(uri: string, config?: FSNetworkRequestConfig): FSNetworkPromise {
    return this.instance.delete(uri, config);
  }

  /**
   * Performs a HEAD request.
   *
   * @param uri A URI or path to request.
   * @param config Configuration for the request.
   * @return A promise of the network response.
   */
  public head(uri: string, config?: FSNetworkRequestConfig): FSNetworkPromise {
    return this.instance.head(uri, config);
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
    return this.instance.post(uri, data, config);
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
    return this.instance.put(uri, data, config);
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
    return this.instance.patch(uri, data, config);
  }
}

/**
 * @deprecated use named export instead
 */
export default FSNetwork;

export type { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
