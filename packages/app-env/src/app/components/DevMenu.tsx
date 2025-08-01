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

export type DevMenuProps = PropsWithChildren<
  Partial<DevMenuContextType> & VersionOverlayProps
>;
export type PresetDevMenuProps = PropsWithChildren<
  Partial<VersionOverlayProps>
>;

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
 * Generates a pre-built dev menu component with the provided options.
 *
 * This generator is intended for static layout navigation systems
 * where top-level context providers must be supplied as components, instead of rendered elements.
 */
export function createDevMenu(opts: Omit<DevMenuProps, 'children'>) {
  function WrappedDevMenu({children, ...restProps}: PresetDevMenuProps) {
    return (
      <DevMenu {...opts} {...restProps}>
        {children}
      </DevMenu>
    );
  }
  WrappedDevMenu.displayName = 'DevMenu';
  return WrappedDevMenu;
}
