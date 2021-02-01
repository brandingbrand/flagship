import { ComponentType } from 'react';
import type { RouteComponentType, ScreenOptions } from './types';

export interface ScreenProps {
  componentId: string;
}

export const makeScreen = (component: ComponentType<ScreenProps>, options?: ScreenOptions) => {
  const route = component as RouteComponentType;
  route.buttons = options?.buttons;
  return route;
};
