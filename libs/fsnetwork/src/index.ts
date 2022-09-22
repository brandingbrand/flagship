export * from './app-interceptor.token';
export * from './http-context';
export * from './types';

export { FSNetwork } from './fsnetwork';

/**
 * @deprecated use named export instead
 */
export { FSNetwork as default } from './fsnetwork';

// Export Axios types so its type definitions are not "private" and other packages depending
// on FSNetwork can use our type aliases
export type { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
