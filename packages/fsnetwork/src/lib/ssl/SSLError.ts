import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ReactNativeSSLPinning } from 'react-native-ssl-pinning';
import { SSLResponse } from './SSLResponse';

export class SSLError implements AxiosError {
  code: string;
  config: AxiosRequestConfig;
  message: string;
  name: string;
  request: any;
  response: AxiosResponse;
  stack: string;
  isAxiosError: boolean;
  toJSON: () => object;

  constructor(
    data: ReactNativeSSLPinning.Response,
    config: AxiosRequestConfig
  ) {
    this.code = data.status && data.status.toString() || '';
    this.config = config;
    this.response = new SSLResponse(data, config);
    this.message = data.bodyString && JSON.parse(data.bodyString).message || '';
    this.name = data.bodyString && JSON.parse(data.bodyString).name || '';
    this.stack = data.bodyString || '';
    this.isAxiosError = true;
    this.toJSON = () => data.bodyString && JSON.parse(data.bodyString).message || '';
  }
}
