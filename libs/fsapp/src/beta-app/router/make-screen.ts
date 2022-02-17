import type { ScreenOptions } from './types';
import type { FC } from 'react';

export interface ScreenProps {
  componentId: string;
}

export const makeScreen = (Component: FC<ScreenProps>, options?: ScreenOptions) => {
  const route = (props: ScreenProps) => Component(props);
  route.buttons = options?.buttons;
  return route;
};
