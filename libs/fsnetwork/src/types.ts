import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import type { HttpContext } from './http-context';

/**
 * Error response object from the network
 */
export type FSNetworkError<T = any, D = any> = AxiosError<T, D>;

/**
 * Configuration for the network request
 *
 * @see https://github.com/axios/axios#request-config
 */
export interface FSNetworkRequestConfig extends AxiosRequestConfig {
  context?: HttpContext;
  // Function that is called to intercept any responses
  responseIntercept?: (response: AxiosResponse) => AxiosResponse;
  // Function that is called to intercept any response errors
  responseError?: (error: FSNetworkError) => FSNetworkError;
}

/**
 * A response object from the network
 *
 * @see https://github.com/axios/axios#response-schema
 */
export interface FSNetworkResponse<T = any> extends AxiosResponse<T> {
  config: FSNetworkRequestConfig & { context: HttpContext };
}

/**
 * A promise of a response from the network
 *
 * @see https://github.com/axios/axios#response-schema
 */
export interface FSNetworkPromise<T = any> extends Promise<FSNetworkResponse<T>> {}

/**
 * The body of a network request
 */
export type FSNetworkRequestData =
  | ArrayBuffer
  | ArrayBufferView
  | Record<string, any>
  | URLSearchParams
  | string;
