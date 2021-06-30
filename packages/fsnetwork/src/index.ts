import {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

import {
  FSNetwork,
  FSNetworkError,
  FSNetworkPromise,
  FSNetworkRequestConfig,
  FSNetworkRequestData,
  FSNetworkResponse
} from './lib';

// Export AxiosResponse type so its type definitions are not "private" and other packages depending
// on FSNetwork can use our type aliases
export {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  FSNetworkError,
  FSNetworkPromise,
  FSNetworkRequestConfig,
  FSNetworkRequestData,
  FSNetworkResponse
};

export default FSNetwork;
