import React from 'react';

import {DevMenuScreenComponentType} from '../types';

/**
 * Defines the supplied component as a custom dev menu screen component.
 *
 * The configured title will be used to populate the Dev Menu list, as well as the screen's header title.
 */
export function defineDevMenuScreen<P = {}>(
  title: string,
  Component: React.ComponentType<P>,
): DevMenuScreenComponentType<P> {
  return Object.assign(Component, {displayName: title});
}
