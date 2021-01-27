import type { FC } from 'react';
import type { ModalComponentType, ModalOptions } from './types';

export const makeModal = <T>(
  type: string,
  component: FC<{ resolve: (data: T) => void; reject: () => void }>,
  options?: ModalOptions
): ModalComponentType<T> => {
  const modal = component as ModalComponentType<T>;
  modal.type = type;
  modal.options = options;
  modal.resolves = (undefined as unknown) as T;
  return modal;
};
