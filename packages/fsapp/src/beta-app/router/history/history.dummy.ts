import type { FSRouterHistory } from './types';
import { NO_NAVIGATOR_CONTEXT_ERROR } from './constants';

const throwError = () => { throw new Error(NO_NAVIGATOR_CONTEXT_ERROR); };

export const dummyHistory: FSRouterHistory = {
  action: 'REPLACE',
  length: 0,
  location: { hash: '', pathname: '', search: '', state: '' },
  block: throwError,
  createHref: throwError,
  go: throwError,
  goBack: throwError,
  goForward: throwError,
  listen: throwError,
  observeLoading: throwError,
  open: throwError,
  pop: throwError,
  push: throwError,
  registerResolver: throwError,
  replace: throwError,
  updateTitle: throwError
};

