import { useApp } from '../app';

export const useServerEffect = (id: string, effect: () => void, dependencies: unknown[]): void => {
  const app = useApp();
  const shouldRun = app?.shouldRunServerEffect(id, dependencies) ?? false;
  if (shouldRun) {
    effect();
  }
};
