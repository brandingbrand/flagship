import type { ComponentType } from 'react';
import type { Mutable } from '../utils';
import type { ModalComponentProps, ModalComponentType, ModalOptions } from './types';
import type { TopBarStyle } from '../router/types';

import { uniqueId } from 'lodash-es';

export const makeModal = <T = void, P = void>(
  component: ComponentType<ModalComponentProps<T> & P>,
  options?: ModalOptions,
  topBarOptions?: TopBarStyle
): ModalComponentType<T, P> => {
  const modal = component as Mutable<ModalComponentType<T, P>>;
  modal.definitionId = uniqueId('Modal');
  modal.options = options;
  modal.topBarOptions = topBarOptions ?? { visible: false };
  return modal as ModalComponentType<T, P>;
};
