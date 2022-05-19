import React, { useContext, useState } from 'react';

import { useAPI } from '../../app';
import { useModals } from '../../modal';
import { makeScreen, useActivatedRoute, useNavigator } from '../../router';
import { useWebShell } from '../../shell.web';
import { IsModalContext } from '../internal/is-modal.context';
import { LegacyNavigator } from '../legacy-navigator';
import type { LegacyTab } from '../legacy-navigator.type';
import type { LegacyRoutableComponentClass } from '../legacy-route.type';

/**
 * @param Component
 * @param tabs
 * @param appConfig
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
        api={api}
        appConfig={appConfig}
        componentId={componentId}
        devMenuHidden={false}
        hideDevMenu={() => {}}
        isWebModal={isModal}
        location={router.location}
        match={activatedRoute}
        navigator={navigator}
        tabs={tabs}
        {...props}
        {...activatedRoute.query}
      />
    );
  });
