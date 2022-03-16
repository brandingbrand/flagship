import type { ScreenComponentType } from '../../router';

import React from 'react';
import { makeModal } from '../../modal';
import { IsModalContext } from '../internal/is-modal.context';

/**
 * @deprecated
 * @internal
 */
export const makeLegacyModal = (Component: ScreenComponentType) =>
  makeModal(() => (
    <IsModalContext.Provider value={true}>
      <Component componentId={''} />
    </IsModalContext.Provider>
  ));
