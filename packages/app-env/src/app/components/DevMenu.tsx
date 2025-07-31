import React, {Fragment, PropsWithChildren, useMemo} from 'react';

import {
  DevMenuContext,
  ModalContextProvider,
  ScreenContextProvider,
} from '../lib/context';
import {showDevMenu} from '../lib/env';
import {DevMenuContextType} from '../types';

import {DevMenuModal} from './DevMenuModal';
import {EnvSwitcher} from './EnvSwitcher';
import {VersionOverlay, VersionOverlayProps} from './VersionOverlay';

export type DevMenuProps = Partial<DevMenuContextType> &
  VersionOverlayProps &
  PropsWithChildren;

export function DevMenu({
  children,
  onEnvChange,
  onRestart,
  screens,
  ...overlayProps
}: DevMenuProps) {
  const ctxObj = useMemo<DevMenuContextType>(
    () => ({
      screens: [EnvSwitcher, ...(screens ?? [])],
      onEnvChange,
      onRestart,
    }),
    [screens, onEnvChange, onRestart],
  );

  if (!showDevMenu) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <DevMenuContext.Provider value={ctxObj}>
      {children}
      <ModalContextProvider>
        <ScreenContextProvider>
          <VersionOverlay {...overlayProps} />
          <DevMenuModal />
        </ScreenContextProvider>
      </ModalContextProvider>
    </DevMenuContext.Provider>
  );
}

/**
 * Generates a prebuilt dev menu component with the provided options.
 *
 * This generator is intended for static layout navigation systems
 * where top-level context providers must be supplied as components, instead of rendered elements.
 */
export function makeDevMenu(opts: Omit<DevMenuProps, 'children'>) {
  function WrappedDevMenu({children}: PropsWithChildren) {
    return <DevMenu {...opts}>{children}</DevMenu>;
  }
  WrappedDevMenu.displayName = 'DevMenu';
  return WrappedDevMenu;
}
