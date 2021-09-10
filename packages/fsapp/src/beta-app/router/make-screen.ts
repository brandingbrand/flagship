import type { ComponentType } from 'react';
import type { ScreenComponentType, ScreenOptions } from './types';

export interface ScreenProps {
  componentId: string;
}

export const makeScreen = (component: ComponentType<ScreenProps>, options?: ScreenOptions) => {
  const route = component as ScreenComponentType;
  route.buttons = options?.buttons;
  return route;
};
