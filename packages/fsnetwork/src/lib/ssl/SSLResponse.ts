import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ReactNativeSSLPinning } from 'react-native-ssl-pinning';

export class SSLResponse<T = any> implements AxiosResponse {
  config: AxiosRequestConfig;
  data: T;
  headers: any;
  request: any;
  status: number;
  statusText: string;

  constructor(
    {
      bodyString,
      status,
      headers
    }: ReactNativeSSLPinning.Response,
    config: AxiosRequestConfig) {
    this.data = bodyString && JSON.parse(bodyString) || '';
    this.status = status;
    this.headers = headers;
    this.config = config;
    this.statusText = bodyString && JSON.parse(bodyString).message || '';
  }
}
