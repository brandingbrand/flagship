import React from 'react';

import { makeModal } from '../../modal';
import type { ScreenComponentType } from '../../router';
import { IsModalContext } from '../internal/is-modal.context';

/**
 * @internal
 * @param Component
 * @deprecated
 */
export const makeLegacyModal = (Component: ScreenComponentType) =>
  makeModal(() => (
    <IsModalContext.Provider value>
      <Component componentId="" />
    </IsModalContext.Provider>
  ));
