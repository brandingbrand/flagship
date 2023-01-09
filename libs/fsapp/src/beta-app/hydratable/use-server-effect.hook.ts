import { useEffect } from 'react';

export const useServerEffect = (_id: string, effect: () => void, dependencies: unknown[]): void => {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- false positive
  useEffect(effect, dependencies);
};
