import { REACT_TOKEN } from './react.token';
import { useToken } from './use-token.hook';

import type { ReactType } from '.';

export const useReact = (): ReactType => useToken(REACT_TOKEN);
