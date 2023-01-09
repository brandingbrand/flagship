import { useApp } from '../app';

export const useServerLayoutEffect = (
  id: string,
  effect: () => void,
  dependencies: unknown[]
): void => {
  const app = useApp();
  const shouldRun = app?.shouldRunServerEffect(id, dependencies) ?? false;
  if (shouldRun) {
    effect();
  }
};
