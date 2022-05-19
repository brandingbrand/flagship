import type * as React from 'react';

import { InjectionToken } from '@brandingbrand/fslinker';

type UsedReactAPIs =
  | 'Children'
  | 'Component'
  | 'createContext'
  | 'createElement'
  | 'Fragment'
  | 'isValidElement'
  | 'memo'
  | 'PureComponent'
  | 'useCallback'
  | 'useContext'
  | 'useEffect'
  | 'useLayoutEffect'
  | 'useMemo'
  | 'useReducer'
  | 'useRef'
  | 'useState';

export type ReactType = Pick<typeof React, UsedReactAPIs>;

export const REACT = new InjectionToken<ReactType>('REACT_TOKEN');
