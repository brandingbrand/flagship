import { REACT } from './react.token';
import { useToken } from './use-token.hook';

export const useReact = () => {
  return useToken(REACT);
};
