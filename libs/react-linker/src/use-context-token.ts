import type { Context } from 'react';

import { InjectionToken } from '@brandingbrand/fslinker';

import { useToken } from './use-token.hook';
import { REACT } from './react.token';

export const useContextToken = <T>(contextToken: InjectionToken<Context<T>>) => {
  const context = useToken(contextToken);
  const { useContext } = useToken(REACT);

  return useContext(context);
};
