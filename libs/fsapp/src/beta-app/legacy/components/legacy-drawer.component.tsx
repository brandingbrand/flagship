import React, { Fragment } from 'react';

import type { ComponentRoute } from '../../router';

/**
 * @internal
 * @param screen
 * @param legacyRoutes
 * @deprecated
 */
export const makeLegacyDrawer = (screen: string, legacyRoutes: Map<string, ComponentRoute>) => {
  const Component = legacyRoutes.get(screen)?.component ?? Fragment;

  return () => <Component componentId={screen} />;
};
