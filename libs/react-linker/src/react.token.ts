import type * as React from 'react';

import { InjectionToken } from '@brandingbrand/fslinker';

type UsedReactAPIs =
  | 'createElement'
  | 'Component'
  | 'PureComponent'
  | 'Children'
  | 'memo'
  | 'createContext'
  | 'isValidElement'
  | 'useState'
  | 'useReducer'
  | 'useEffect'
  | 'useLayoutEffect'
  | 'useMemo'
  | 'useCallback'
  | 'useContext'
  | 'useRef';

export type ReactType = Pick<typeof React, UsedReactAPIs>;

export const REACT = new InjectionToken<ReactType>('REACT_TOKEN');
