import type { Context } from 'react';
import { InjectionToken, Injector } from '@brandingbrand/fslinker';

import { REACT } from './react.token';

export const provideContext = <T>(name: string, initialValue: T) => {
  const React = Injector.require(REACT);

  const token = new InjectionToken<Context<T>>(name);
  if (!Injector.has(token)) {
    Injector.provide({ provide: token, useValue: React.createContext(initialValue) });
  }

  return token;
};
