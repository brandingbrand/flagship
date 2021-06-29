import axios, {
  AxiosInstance
} from 'axios';

import {
  FSNetworkPromise,
  FSNetworkRequestConfig,
  FSNetworkRequestData
} from './interfaces';

import { SSLPinningInstance } from './sll';

// As of Axios 0.18, the typings don't show the Axios property even though it exists
/**
 * Manages network requests, optionally adding a set of default configuration to each request.
 */
export class FSNetwork {
  private instance: AxiosInstance | SSLPinningInstance;
  private interceptor?: number;
  /**
   * Creates a new instance of FSNetwork.
   *
   * @param {FSNetworkRequestConfig} config Default configuration to apply to every request.
   */
  constructor(config?: FSNetworkRequestConfig) {
    if (config) {
      const {
        responseIntercept,
        responseError,
        pinnedCertificates,
        ...axiosConfig
      } = config;

      const certificatesForInstance = pinnedCertificates && pinnedCertificates.filter(
        ({ baseUrl }) => {
          return config.baseURL
            ? config.baseURL.includes(baseUrl)
            : false;
        }
      );

      if (certificatesForInstance && certificatesForInstance.length) {
        this.instance = new SSLPinningInstance(certificatesForInstance, config);
      } else {
        this.instance = axios.create(axiosConfig);
        this.setInterceptor(config);
      }
    } else {
      this.instance = axios.create();
    }
  }

  removeInterceptor(): void {
    if (this.interceptor !== undefined && !(this.instance instanceof SSLPinningInstance)) {
      this.instance.interceptors.response.eject(this.interceptor);
      this.interceptor = undefined;
    }
  }

  setInterceptor(config?: FSNetworkRequestConfig): void {
    this.removeInterceptor();
    if (
      config &&
      (config.responseIntercept || config.responseError) &&
      !(this.instance instanceof SSLPinningInstance)
    ) {
      this.interceptor = this.instance.interceptors.response.use(
        config.responseIntercept,
        config.responseError
      );
    }
  }

  /**
   * Performs a generic request.
   *
   * @param {FSNetworkRequestConfig} config Configuration for the request.
   * @returns {FSNetworkPromise<T>} A promise of the network response.
   */
  request<T = any>(config: FSNetworkRequestConfig): FSNetworkPromise<T> {
    return this.instance.request(config);
  }

  /**
   * Performs a GET request.
   *
   * @template T The response data type.
   * @param {string} uri A URI or path to request.
   * @param {FSNetworkRequestConfig} config Configuration for the request.
   * @returns {FSNetworkPromise<T>} A promise of the network response.
   */
  get<T = any>(uri: string, config?: FSNetworkRequestConfig): FSNetworkPromise<T> {
    // TODO: caching
    return this.instance.get(uri, config);
  }

  /**
   * Performs a DELETE request.
   *
   * @param {string} uri A URI or path to request.
   * @param {FSNetworkRequestConfig} config Configuration for the request.
   * @returns {FSNetworkPromise} A promise of the network response.
   */
  delete(uri: string, config?: FSNetworkRequestConfig): FSNetworkPromise {
    return this.instance.delete(uri, config);
  }

  /**
   * Performs a HEAD request.
   * Not available with SSL
   *
   * @param {string} uri A URI or path to request.
   * @param {FSNetworkRequestConfig} config Configuration for the request.
   * @returns {FSNetworkPromise} A promise of the network response.
   */
  head(uri: string, config?: FSNetworkRequestConfig): FSNetworkPromise {
    return this.instance.head(uri, config);
  }

  /**
   * Performs a POST request.
   *
   * @template T The response data type.
   * @param {string} uri A URI or path to request.
   * @param {FSNetworkRequestData} data The body of the request.
   * @param {FSNetworkRequestConfig} config Configuration for the request.
   * @returns {FSNetworkPromise<T>} A promise of the network response.
   */
  post<T = any>(
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
   * @param {string} uri A URI or path to request.
   * @param {FSNetworkRequestData} data The body of the request.
   * @param {FSNetworkRequestConfig} config Configuration for the request.
   * @returns {FSNetworkPromise<T>} A promise of the network response.
   */
  put<T = any>(
    uri: string,
    data?: FSNetworkRequestData,
    config?: FSNetworkRequestConfig
  ): FSNetworkPromise<T> {
    return this.instance.put(uri, data, config);
  }

  /**
   * Performs a PATCH request.
   * Not available with SSL
   *
   * @template T The response data type.
   * @param {string} uri A URI or path to request.
   * @param {FSNetworkRequestData} data The body of the request.
   * @param {FSNetworkRequestConfig} config Configuration for the request.
   * @returns {FSNetworkPromise<T>} A promise of the network response.
   */
  patch<T = any>(
    uri: string,
    data?: FSNetworkRequestData,
    config?: FSNetworkRequestConfig
  ): FSNetworkPromise<T> {
    return this.instance.patch(uri, data, config);
  }
}
