import type * as React from 'react';

import { Injector } from '@brandingbrand/fslinker';

import { REACT_TOKEN } from './react.token';

export const initializeReactLinker = (react: typeof React) => {
  if (!Injector.has(REACT_TOKEN)) {
    Injector.provide({ provide: REACT_TOKEN, useValue: react });
  }
};
