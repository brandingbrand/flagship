import React, { Fragment } from 'react';
import { ComponentRoute } from '../../router';

/**
 * @deprecated
 * @internal
 */
export const makeLegacyDrawer = (screen: string, legacyRoutes: Map<string, ComponentRoute>) => {
  const Component = legacyRoutes.get(screen)?.component ?? Fragment;

  return () => {
    return <Component componentId={screen} />;
  };
};
