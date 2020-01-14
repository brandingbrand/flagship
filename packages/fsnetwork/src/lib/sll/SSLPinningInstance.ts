import Axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { SSLMethodType, SSLRequest } from './SSLRequest';
import { FSNetworkRequestConfig, PinnedCertificate } from '../interfaces';

export class SSLPinningInstance {
  private defaults: AxiosRequestConfig = Axios.defaults;
  private readonly config: FSNetworkRequestConfig;
  private sslRequest: SSLRequest;

  constructor(certificates: PinnedCertificate[], config?: FSNetworkRequestConfig) {
    this.config = { ...this.defaults, ...config };
    this.sslRequest = new SSLRequest(certificates);
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
    return this.sslRequest.send({
      ...this.config,
      ...config
    });
  }

  get = <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> => {
    return this.sslRequest.send({
      ...this.config,
      ...config,
      url
    }, SSLMethodType.Get);
  }

  post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> => {
    return this.sslRequest.send({
      ...this.config,
      ...config,
      url
    }, SSLMethodType.Post, data);
  }

  delete = (url: string, config?: AxiosRequestConfig): AxiosPromise => {
    return this.sslRequest.send({
      ...this.config,
      ...config,
      url
    }, SSLMethodType.Delete);
  }

  put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> => {
    return this.sslRequest.send({
      ...this.config,
      ...config,
      url
    }, SSLMethodType.Put, data);
  }

  head = (url: string, config?: AxiosRequestConfig): AxiosPromise => {
    throw new Error('Method HEAD not allowed for SSL Pinning request');
  }

  patch = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> => {
    throw new Error('Method PATCH not allowed not allowed for SSL Pinning request');
  }
}
