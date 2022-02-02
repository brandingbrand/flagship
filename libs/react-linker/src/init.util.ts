import { Injector } from '@brandingbrand/fslinker';
import type * as React from 'react';

import { REACT } from './react.token';

export const initializeReactLinker = (react: typeof React) => {
  if (!Injector.has(REACT)) {
    Injector.provide({ provide: REACT, useValue: react });
  }
};
