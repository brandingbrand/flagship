import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
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

  request = async <T = any, R = AxiosResponse<T>> (config: AxiosRequestConfig): Promise<R> => {
    return this.sslRequest.send({
      ...this.config,
      ...config
    });
  }

  get = async <T = any, R = AxiosResponse<T>> (
    url: string, config?: AxiosRequestConfig
  ): Promise<R> => {
    return this.sslRequest.send({
      ...this.config,
      ...config,
      url
    }, SSLMethodType.Get);
  }

  post = async <T = any, R = AxiosResponse<T>>(
    url: string, data?: any, config?: AxiosRequestConfig
  ): Promise<R> => {
    return this.sslRequest.send({
      ...this.config,
      ...config,
      url
    }, SSLMethodType.Post, data);
  }

  delete = async <T = any, R = AxiosResponse<T>>(
    url: string, config?: AxiosRequestConfig
  ): Promise<R> => {
    return this.sslRequest.send({
      ...this.config,
      ...config,
      url
    }, SSLMethodType.Delete);
  }

  put = async <T = any, R = AxiosResponse<T>>(
    url: string, data?: any, config?: AxiosRequestConfig
  ): Promise<R> => {
    return this.sslRequest.send({
      ...this.config,
      ...config,
      url
    }, SSLMethodType.Put, data);
  }

  // tslint:disable promise-function-async

  head = <T = any, R = AxiosResponse<T>>(
    url: string, config?: AxiosRequestConfig
  ): Promise<R> => {
    throw new Error('Method HEAD not allowed for SSL Pinning request');
  }

  patch = <T = any, R = AxiosResponse<T>>(
    url: string, data?: any, config?: AxiosRequestConfig
  ): Promise<R> => {
    throw new Error('Method PATCH not allowed for SSL Pinning request');
  }
}
