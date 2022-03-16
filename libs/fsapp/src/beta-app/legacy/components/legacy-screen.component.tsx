import type { LegacyRoutableComponentClass } from '../legacy-route.type';
import type { LegacyTab } from '../legacy-navigator.type';

import React, { useContext, useState } from 'react';

import { makeScreen, useActivatedRoute, useNavigator } from '../../router';
import { useModals } from '../../modal';
import { useAPI } from '../../app';

import { LegacyNavigator } from '../legacy-navigator';
import { useWebShell } from '../../shell.web';
import { IsModalContext } from '../internal/is-modal.context';

/**
 * @deprecated
 */
export const makeLegacyScreen = (
  Component: LegacyRoutableComponentClass,
  tabs: LegacyTab[],
  appConfig: unknown
) =>
  makeScreen(({ componentId, ...props }) => {
    const isModal = useContext(IsModalContext);
    const router = useNavigator();
    const activatedRoute = useActivatedRoute();
    const modals = useModals();
    const shell = useWebShell();
    const [navigator] = useState(
      () => new LegacyNavigator(componentId, tabs, router, modals, shell)
    );

    const api = useAPI();

    return (
      <Component
        isWebModal={isModal}
        componentId={componentId}
        tabs={tabs}
        navigator={navigator}
        appConfig={appConfig}
        api={api}
        match={activatedRoute}
        location={router.location}
        devMenuHidden={false}
        hideDevMenu={() => {}}
        {...props}
        {...activatedRoute.query}
      />
    );
  });
