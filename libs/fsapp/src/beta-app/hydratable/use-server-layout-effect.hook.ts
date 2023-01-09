import { useLayoutEffect } from 'react';

export const useServerLayoutEffect = (
  _id: string,
  effect: () => void,
  dependencies: unknown[]
): void => {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- false positive
  useLayoutEffect(effect, dependencies);
};
