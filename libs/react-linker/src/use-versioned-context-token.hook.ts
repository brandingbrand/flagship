import type { Context } from 'react';

import type { InjectionToken } from '@brandingbrand/fslinker';

import { REACT_TOKEN } from './react.token';
import { useToken } from './use-token.hook';
import { useVersionedToken } from './use-versioned-token.hook';

export const useVersionedContextToken = <T>(contextToken: InjectionToken<Context<T>>): T => {
  const context = useVersionedToken(contextToken);
  const { useContext } = useToken(REACT_TOKEN);

  return useContext(context);
};
