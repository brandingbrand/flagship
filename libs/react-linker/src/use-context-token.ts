import type { Context } from 'react';

import type { InjectionToken } from '@brandingbrand/fslinker';

import { REACT_TOKEN } from './react.token';
import { useToken } from './use-token.hook';

export const useContextToken = <T>(contextToken: InjectionToken<Context<T>>) => {
  const context = useToken(contextToken);
  const { useContext } = useToken(REACT_TOKEN);

  return useContext(context);
};
