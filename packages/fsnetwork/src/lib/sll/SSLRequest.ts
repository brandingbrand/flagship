import { fetch, ReactNativeSSLPinning } from 'react-native-ssl-pinning';
import { FSNetworkRequestConfig, PinnedCertificate } from '../interfaces';
import { SSLResponse } from './SSLResponse';
import { SSLError } from './SSLError';
import { baseName, buildURL } from '../utils';

type SSLMethods = SSLMethodType;

export enum SSLMethodType {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}

export class SSLRequest {

  private readonly baseRequestOptions: ReactNativeSSLPinning.Options;

  constructor(certificates: PinnedCertificate[]) {
    this.baseRequestOptions = {
      sslPinning: {
        certs: certificates.map(({ path }) => baseName(path))
      }
    };
  }

  async send<T = any>(
    config: FSNetworkRequestConfig,
    method?: SSLMethods,
    body?: any
  ): Promise<any> {
    if (!config.url) {
      throw new Error('URL is required');
    }

    const requestUrl = config.params
      ? buildURL(config.baseURL + config.url, config.params)
      : config.baseURL + config.url;
    try {
      let jsonBody: string | undefined;
      if (body) {
        jsonBody = JSON.stringify(body);
      }

      const fetchThis = await fetch(requestUrl, {
        ...this.baseRequestOptions,
        ...this.parseConfigToOptions(config, method),
        method,
        body: jsonBody
      });

      return new SSLResponse(fetchThis, config);
    } catch (e) {
      return new SSLError(e, config);
    }
  }

  private parseConfigToOptions = (config: FSNetworkRequestConfig, method?: SSLMethods)
  : Partial<ReactNativeSSLPinning.Options> => {
    let headers: ReactNativeSSLPinning.Header;
    if (method && config.headers[method.toLowerCase()]) {
      headers = config.headers[method.toLowerCase()];
    } else {
      headers = config.headers;
    }
    return {
      headers: {
        ...headers,
        'Content-Type': 'application/json;charset=UTF-8'
      },
      timeoutInterval: config.timeout
    };
  }
}
