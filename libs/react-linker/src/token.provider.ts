import type { Context } from 'react';
import type { InjectionToken } from '@brandingbrand/fslinker';

import { useReact } from './use-react.hook';
import { useToken } from './use-token.hook';

export interface TokenProviderProps<T> {
  token: InjectionToken<Context<T>>;
  value: T;
  children?: React.ReactNode;
}

export const TokenProvider = <T>({ value, token, children }: TokenProviderProps<T>) => {
  const React = useReact();
  const context = useToken(token);

  return React.createElement(context.Provider, { value }, children);
};
