import {
  AxiosError,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';
import { Dictionary } from '@brandingbrand/fsfoundation';
/**
 * Error response object from the network.
 */
export type FSNetworkError = AxiosError;

export interface PinnedCertificate {
  baseUrl: string;
  path: string;
}

/**
 * Configuration for the network request.
 *
 * @see https://github.com/axios/axios#request-config
 */
export interface FSNetworkRequestConfig extends AxiosRequestConfig {
  // Property that defines array of pinned certificate for FSNetwork
  pinnedCertificates?: PinnedCertificate[];
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
  ArrayBuffer |
  ArrayBufferView |
  Dictionary |
  string |
  URLSearchParams;
