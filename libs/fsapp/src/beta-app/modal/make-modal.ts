import type { ComponentType } from 'react';

import { uniqueId } from 'lodash-es';

import type { TopBarStyle } from '../router/types';
import type { Mutable } from '../utils';

import type { ModalComponentProps, ModalComponentType, ModalOptions } from './types';

export const makeModal = <T = void, P = {}>(
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