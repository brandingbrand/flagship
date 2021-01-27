import type { FC } from 'react';
import type { ModalComponentProps, ModalComponentType, ModalOptions } from './types';

import { Navigation } from 'react-native-navigation';

export const makeModal = <T>(
  type: string,
  component: FC<ModalComponentProps<T>>,
  options?: ModalOptions
): ModalComponentType<T> => {
  const modal = component as ModalComponentType<T>;
  modal.type = type;
  modal.options = options;
  modal.resolves = (undefined as unknown) as T;
  Navigation.registerComponent(modal.type, () => component);
  return modal;
};
